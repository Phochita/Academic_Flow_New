import expressTypes = require("express");
import profileService = require("../services/profile");
import subscriptionService = require("../services/subscription");
import supabaseUtils = require("../utils/supabase");
import httpUtils = require("../utils/http");

const { syncProfileFromAuthUser } = profileService;
const { refreshExpiredSubscriptionsForUser, syncUserProStatus } = subscriptionService;
const { supabaseAdmin } = supabaseUtils;
const { HttpError } = httpUtils;

const extractBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new HttpError(401, "Authorization header must use the Bearer scheme.");
  }

  return token;
};

const loadAuthContext = async (token: string) => {
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    throw new HttpError(401, "Invalid or expired access token.");
  }

  const profile = await syncProfileFromAuthUser({
    id: data.user.id,
    email: data.user.email ?? null,
    user_metadata: data.user.user_metadata ?? null,
  });

  await refreshExpiredSubscriptionsForUser(data.user.id);
  const proStatus = await syncUserProStatus(data.user.id);

  return {
    accessToken: token,
    email: profile?.email ?? data.user.email ?? null,
    fullName: profile?.fullName ?? null,
    isPro: proStatus.isPro,
    role: profileService.normalizeRole(profile?.role),
    userId: data.user.id,
  };
};

const optionalAuth: expressTypes.RequestHandler = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req.header("authorization"));

    if (!token) {
      return next();
    }

    req.auth = await loadAuthContext(token);
    return next();
  } catch (error) {
    return next(error);
  }
};

const requireAuth: expressTypes.RequestHandler = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req.header("authorization"));

    if (!token) {
      throw new HttpError(401, "Authentication is required.");
    }

    req.auth = await loadAuthContext(token);
    return next();
  } catch (error) {
    return next(error);
  }
};

export = {
  loadAuthContext,
  optionalAuth,
  requireAuth,
};
