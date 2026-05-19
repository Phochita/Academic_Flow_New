import expressTypes = require("express");
import zod = require("zod");
import profileService = require("../services/profile");
import subscriptionService = require("../services/subscription");
import httpUtils = require("../utils/http");

const { z } = zod;
const { getProfileById } = profileService;
const {
  activateSubscription,
  approveSubscription,
  createAbaPaySandboxSession,
  createPendingSubscriptionRequest,
  getAdminSubscriptions,
  getPlans,
  getUserSubscriptions,
  refreshExpiredSubscriptionsForUser,
} = subscriptionService;
const { HttpError } = httpUtils;

const activateSubscriptionSchema = z.object({
  plan: z.string().trim().min(1).max(50),
  startDate: z.iso.datetime().optional(),
});

const createAbaPaySandboxSessionSchema = z.object({
  plan: z.string().trim().min(1).max(50),
});

const confirmPaymentSchema = z.object({
  plan: z.string().trim().min(1).max(50),
  providerTransactionId: z.string().trim().min(3).max(120),
  reference: z.string().trim().min(8).max(120),
});

const subscriptionIdParamsSchema = z.object({
  subscriptionId: z.coerce.number().int().positive(),
});

const buildSubscriptionPayload = async (userId: string) => {
  await refreshExpiredSubscriptionsForUser(userId);

  const [profile, history] = await Promise.all([getProfileById(userId), getUserSubscriptions(userId)]);
  const activeSubscription = history.find((subscription) => subscription.status === "active") ?? null;

  return {
    activeSubscription,
    history,
    isPro: Boolean(profile?.isPro),
    plans: getPlans(),
    userId,
  };
};

const listPlans = async (_req: expressTypes.Request, res: expressTypes.Response) => {
  res.status(200).json({
    plans: getPlans(),
  });
};

const getSubscriptions = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const targetUserId =
    req.auth.role === "admin" && typeof req.query.userId === "string" ? req.query.userId : req.auth.userId;

  res.status(200).json(await buildSubscriptionPayload(targetUserId));
};

const activateMySubscription = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  activateSubscriptionSchema.parse(req.body);
  throw new HttpError(400, "Create an ABA Pay sandbox session and confirm the sandbox payment before activating a subscription.");
};

const getAdminSubscriptionRequests = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth || req.auth.role !== "admin") {
    throw new HttpError(403, "Admin access is required.");
  }

  const rows = await getAdminSubscriptions();

  res.status(200).json({
    subscriptions: rows.map((row) => ({
      customer: {
        email: row.profile?.email ?? null,
        fullName: row.profile?.fullName ?? null,
        id: row.profile?.id ?? row.subscription.userId,
      },
      billingCycle: row.subscription.billingCycle,
      createdAt: row.subscription.createdAt,
      endDate: row.subscription.endDate,
      id: row.subscription.id,
      mrrUsd: row.subscription.mrrUsd,
      plan: row.subscription.plan,
      startDate: row.subscription.startDate,
      status: row.subscription.status,
      statusReason: row.subscription.statusReason,
      userId: row.subscription.userId,
    })),
  });
};

const createMyAbaPaySandboxSession = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const payload = createAbaPaySandboxSessionSchema.parse(req.body);
  const abaPaySession = createAbaPaySandboxSession({
    planCode: payload.plan,
    userId: req.auth.userId,
  });

  res.status(201).json({
    abaPaySession,
    message: "ABA Pay sandbox session created successfully.",
  });
};

const confirmMyPayment = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const payload = confirmPaymentSchema.parse(req.body);

  await createPendingSubscriptionRequest({
    planCode: payload.plan,
    providerTransactionId: payload.providerTransactionId,
    reference: payload.reference,
    userId: req.auth.userId,
  });

  res.status(201).json({
    message: "Payment confirmed and sent to admin for approval.",
    payment: {
      provider: "aba_pay_sandbox",
      providerTransactionId: payload.providerTransactionId ?? null,
      reference: payload.reference,
      status: "pending_admin_approval",
    },
    ...(await buildSubscriptionPayload(req.auth.userId)),
  });
};

const approvePendingSubscription = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth || req.auth.role !== "admin") {
    throw new HttpError(403, "Admin access is required.");
  }

  const { subscriptionId } = subscriptionIdParamsSchema.parse(req.params);
  const approval = await approveSubscription(subscriptionId);

  res.status(200).json({
    approval,
    message: "Subscription approved and activated successfully.",
  });
};

const refreshSubscriptionStatus = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const targetUserId =
    req.auth.role === "admin" && typeof req.query.userId === "string" ? req.query.userId : req.auth.userId;

  await refreshExpiredSubscriptionsForUser(targetUserId);

  res.status(200).json({
    message: "Subscription status refreshed successfully.",
    ...(await buildSubscriptionPayload(targetUserId)),
  });
};

export = {
  activateMySubscription,
  approvePendingSubscription,
  confirmMyPayment,
  createMyAbaPaySandboxSession,
  getAdminSubscriptionRequests,
  getSubscriptions,
  listPlans,
  refreshSubscriptionStatus,
};
