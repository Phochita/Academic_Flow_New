import drizzleOrm = require("drizzle-orm");
import dbModule = require("../db");
import schema = require("../db/schema");
import httpUtils = require("../utils/http");

const { and, desc, eq, lte } = drizzleOrm;
const { db } = dbModule;
const { profiles, subscriptions } = schema;
const { HttpError } = httpUtils;

const planCatalog = [
  {
    code: "monthly",
    name: "Monthly Pro",
    priceUsd: 9.99,
    durationDays: 30,
    features: ["Advanced analytics", "AI planner access", "Priority reminders"],
  },
  {
    code: "semester",
    name: "Semester Pro",
    priceUsd: 39.99,
    durationDays: 180,
    features: ["Everything in Monthly", "Long-term planner support", "Attendance insights"],
  },
  {
    code: "annual",
    name: "Annual Pro",
    priceUsd: 69.99,
    durationDays: 365,
    features: ["Everything in Semester", "Best-value pricing", "Extended history retention"],
  },
] as const;

type AbaPaySandboxSessionInput = {
  planCode: string;
  userId: string;
};

const getPlans = () => planCatalog.map((plan) => ({ ...plan }));

const getPlanByCode = (planCode: string) =>
  planCatalog.find((plan) => plan.code === planCode.trim().toLowerCase()) ?? null;

const calculateEndDate = (startDate: Date, durationDays: number) => {
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + durationDays);
  return endDate;
};

const createAbaPaySandboxSession = ({ planCode, userId }: AbaPaySandboxSessionInput) => {
  const selectedPlan = getPlanByCode(planCode);

  if (!selectedPlan) {
    throw new HttpError(400, "Unknown subscription plan.");
  }

  const merchantId = process.env.ABA_PAY_SANDBOX_MERCHANT_ID?.trim() || "ACAFLOW_SANDBOX";
  const merchantName = process.env.ABA_PAY_SANDBOX_MERCHANT_NAME?.trim() || "AcaFlow Sandbox";
  const provider = process.env.ABA_PAY_SANDBOX_PROVIDER?.trim() || "aba_pay_sandbox";
  const reference = `AF-${selectedPlan.code.toUpperCase()}-${Date.now()}-${userId.slice(0, 8)}`;

  return {
    amountUsd: selectedPlan.priceUsd,
    currency: "USD",
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    merchantId,
    merchantName,
    paymentMethod: "aba_pay_sandbox",
    plan: selectedPlan,
    provider,
    reference,
    status: "pending",
  };
};

const getActiveSubscriptionInternal = async (userId: string) => {
  const [activeSubscription] = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")))
    .orderBy(desc(subscriptions.endDate))
    .limit(1);

  return activeSubscription ?? null;
};

const getUserSubscriptions = async (userId: string) => {
  await refreshExpiredSubscriptionsForUser(userId);

  return db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).orderBy(desc(subscriptions.createdAt));
};

const getAdminSubscriptions = async () =>
  db
    .select({
      profile: profiles,
      subscription: subscriptions,
    })
    .from(subscriptions)
    .leftJoin(profiles, eq(subscriptions.userId, profiles.id))
    .orderBy(desc(subscriptions.createdAt));

const getActiveSubscription = async (userId: string) => {
  await refreshExpiredSubscriptionsForUser(userId);

  return getActiveSubscriptionInternal(userId);
};

const syncUserProStatus = async (userId: string) => {
  const activeSubscription = await getActiveSubscriptionInternal(userId);
  const isPro = Boolean(activeSubscription);

  await db.update(profiles).set({ isPro }).where(eq(profiles.id, userId));

  return {
    activeSubscription,
    isPro,
  };
};

const refreshExpiredSubscriptionsForUser = async (userId?: string) => {
  const now = new Date();
  const conditions = [eq(subscriptions.status, "active"), lte(subscriptions.endDate, now)];

  if (userId) {
    conditions.push(eq(subscriptions.userId, userId));
  }

  const expiredSubscriptions = await db
    .update(subscriptions)
    .set({ status: "expired" })
    .where(and(...conditions))
    .returning({ userId: subscriptions.userId });

  const affectedUserIds = new Set<string>();

  for (const row of expiredSubscriptions) {
    if (row.userId) {
      affectedUserIds.add(row.userId);
    }
  }

  if (userId) {
    affectedUserIds.add(userId);
  }

  for (const affectedUserId of affectedUserIds) {
    await syncUserProStatus(affectedUserId);
  }

  return expiredSubscriptions.length;
};

const activateSubscription = async (userId: string, planCode: string, startDate?: Date) => {
  const selectedPlan = getPlanByCode(planCode);

  if (!selectedPlan) {
    throw new HttpError(400, "Unknown subscription plan.");
  }

  await refreshExpiredSubscriptionsForUser(userId);

  await db
    .update(subscriptions)
    .set({ status: "cancelled" })
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")));

  const normalizedStartDate = startDate ?? new Date();
  const endDate = calculateEndDate(normalizedStartDate, selectedPlan.durationDays);

  const [createdSubscription] = await db
    .insert(subscriptions)
    .values({
      userId,
      plan: selectedPlan.code,
      startDate: normalizedStartDate,
      endDate,
      status: "active",
    })
    .returning();

  const proStatus = await syncUserProStatus(userId);

  return {
    plan: selectedPlan,
    subscription: createdSubscription ?? null,
    ...proStatus,
  };
};

const createPendingSubscriptionRequest = async ({
  planCode,
  providerTransactionId,
  reference,
  userId,
}: {
  planCode: string;
  providerTransactionId: string;
  reference: string;
  userId: string;
}) => {
  const selectedPlan = getPlanByCode(planCode);

  if (!selectedPlan) {
    throw new HttpError(400, "Unknown subscription plan.");
  }

  await refreshExpiredSubscriptionsForUser(userId);

  await db
    .update(subscriptions)
    .set({ status: "cancelled", statusReason: "Replaced by a newer pending payment request." })
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "pending")));

  const requestedAt = new Date();
  const provisionalEndDate = calculateEndDate(requestedAt, selectedPlan.durationDays);

  const [createdSubscription] = await db
    .insert(subscriptions)
    .values({
      billingCycle: selectedPlan.code,
      mrrUsd: selectedPlan.priceUsd,
      plan: selectedPlan.code,
      startDate: requestedAt,
      endDate: provisionalEndDate,
      status: "pending",
      statusReason: `Awaiting admin approval. ABA reference: ${reference}. Transaction: ${providerTransactionId}.`,
      stripeSubscriptionId: reference,
      userId,
    })
    .returning();

  await syncUserProStatus(userId);

  return {
    plan: selectedPlan,
    subscription: createdSubscription ?? null,
  };
};

const approveSubscription = async (subscriptionId: number) => {
  const [pendingSubscription] = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.status, "pending")))
    .limit(1);

  if (!pendingSubscription?.userId || !pendingSubscription.plan) {
    throw new HttpError(404, "Pending subscription request not found.");
  }

  const selectedPlan = getPlanByCode(pendingSubscription.plan);

  if (!selectedPlan) {
    throw new HttpError(400, "Unknown subscription plan.");
  }

  await refreshExpiredSubscriptionsForUser(pendingSubscription.userId);

  await db
    .update(subscriptions)
    .set({ status: "cancelled", statusReason: "Cancelled by admin approval of a newer subscription." })
    .where(and(eq(subscriptions.userId, pendingSubscription.userId), eq(subscriptions.status, "active")));

  const approvedAt = new Date();
  const endDate = calculateEndDate(approvedAt, selectedPlan.durationDays);

  const [approvedSubscription] = await db
    .update(subscriptions)
    .set({
      endDate,
      startDate: approvedAt,
      status: "active",
      statusReason: "Approved by admin.",
    })
    .where(eq(subscriptions.id, subscriptionId))
    .returning();

  const proStatus = await syncUserProStatus(pendingSubscription.userId);

  return {
    plan: selectedPlan,
    subscription: approvedSubscription ?? null,
    ...proStatus,
  };
};

export = {
  approveSubscription,
  activateSubscription,
  createAbaPaySandboxSession,
  createPendingSubscriptionRequest,
  getAdminSubscriptions,
  getActiveSubscription,
  getPlans,
  getUserSubscriptions,
  refreshExpiredSubscriptionsForUser,
  syncUserProStatus,
};
