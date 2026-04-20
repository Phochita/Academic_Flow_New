import expressTypes = require("express");
import zod = require("zod");
import profileService = require("../services/profile");
import subscriptionService = require("../services/subscription");
import httpUtils = require("../utils/http");

const { z } = zod;
const { getProfileById } = profileService;
const { activateSubscription, getPlans, getUserSubscriptions, refreshExpiredSubscriptionsForUser } = subscriptionService;
const { HttpError } = httpUtils;

const activateSubscriptionSchema = z.object({
  plan: z.string().trim().min(1).max(50),
  startDate: z.iso.datetime().optional(),
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

  const payload = activateSubscriptionSchema.parse(req.body);
  const startDate = payload.startDate ? new Date(payload.startDate) : undefined;

  await activateSubscription(req.auth.userId, payload.plan, startDate);

  res.status(201).json({
    message: "Subscription activated successfully.",
    ...(await buildSubscriptionPayload(req.auth.userId)),
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
  getSubscriptions,
  listPlans,
  refreshSubscriptionStatus,
};
