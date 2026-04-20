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

const getPlans = () => planCatalog.map((plan) => ({ ...plan }));

const getPlanByCode = (planCode: string) =>
  planCatalog.find((plan) => plan.code === planCode.trim().toLowerCase()) ?? null;

const calculateEndDate = (startDate: Date, durationDays: number) => {
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + durationDays);
  return endDate;
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

export = {
  activateSubscription,
  getActiveSubscription,
  getPlans,
  getUserSubscriptions,
  refreshExpiredSubscriptionsForUser,
  syncUserProStatus,
};
