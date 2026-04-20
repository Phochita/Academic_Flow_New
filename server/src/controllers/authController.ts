import expressTypes = require("express");
import zod = require("zod");
import profileService = require("../services/profile");
import subscriptionService = require("../services/subscription");
import supabaseUtils = require("../utils/supabase");
import httpUtils = require("../utils/http");

const { z } = zod;
const { createSupabaseClient } = supabaseUtils;
const { getProfileById, syncProfile, syncProfileFromAuthUser, buildFullName } = profileService;
const { getUserSubscriptions, refreshExpiredSubscriptionsForUser } = subscriptionService;
const { HttpError } = httpUtils;

const registerSchema = z.object({
  email: z.email().trim().toLowerCase(),
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  password: z.string().min(8).max(128),
  role: z.enum(["student", "lecturer", "admin"]).default("student"),
});

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
});

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
});

const formatUser = (profile: Awaited<ReturnType<typeof getProfileById>>, fallbackEmail?: string | null) => ({
  id: profile?.id ?? null,
  email: profile?.email ?? fallbackEmail ?? null,
  fullName: profile?.fullName ?? null,
  role: profileService.normalizeRole(profile?.role),
  isPro: Boolean(profile?.isPro),
});

const formatSession = (session: {
  access_token: string;
  refresh_token: string;
  expires_at?: number | null;
  token_type: string;
} | null) => {
  if (!session) {
    return null;
  }

  return {
    accessToken: session.access_token,
    expiresAt: session.expires_at ?? null,
    refreshToken: session.refresh_token,
    tokenType: session.token_type,
  };
};

const register = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const payload = registerSchema.parse(req.body);
  const fullName = buildFullName([payload.firstName, payload.lastName]);
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        first_name: payload.firstName,
        last_name: payload.lastName,
        full_name: fullName,
        role: payload.role,
      },
    },
  });

  if (error || !data.user) {
    throw new HttpError(400, error?.message ?? "Registration failed.");
  }

  await syncProfileFromAuthUser({
    id: data.user.id,
    email: data.user.email ?? payload.email,
    user_metadata: data.user.user_metadata ?? {
      first_name: payload.firstName,
      full_name: fullName,
      last_name: payload.lastName,
      role: payload.role,
    },
  });

  await refreshExpiredSubscriptionsForUser(data.user.id);

  const profile = await getProfileById(data.user.id);

  res.status(201).json({
    message: data.session
      ? "Account created successfully."
      : "Account created successfully. Email confirmation may still be required.",
    session: formatSession(data.session),
    user: formatUser(profile, data.user.email ?? payload.email),
  });
};

const login = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const payload = loginSchema.parse(req.body);
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error || !data.user) {
    throw new HttpError(401, error?.message ?? "Invalid email or password.");
  }

  await syncProfileFromAuthUser({
    id: data.user.id,
    email: data.user.email ?? payload.email,
    user_metadata: data.user.user_metadata ?? null,
  });

  await refreshExpiredSubscriptionsForUser(data.user.id);

  const profile = await getProfileById(data.user.id);

  res.status(200).json({
    message: "Login successful.",
    session: formatSession(data.session),
    user: formatUser(profile, data.user.email ?? payload.email),
  });
};

const getMe = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const profile = await getProfileById(req.auth.userId);
  const subscriptions = await getUserSubscriptions(req.auth.userId);

  res.status(200).json({
    user: formatUser(profile, req.auth.email),
    subscriptions,
  });
};

const updateMe = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const payload = updateProfileSchema.parse(req.body);

  await syncProfile({
    id: req.auth.userId,
    email: req.auth.email,
    fullName: payload.fullName,
    role: req.auth.role,
  });

  const profile = await getProfileById(req.auth.userId);

  res.status(200).json({
    message: "Profile updated successfully.",
    user: formatUser(profile, req.auth.email),
  });
};

export = {
  getMe,
  login,
  register,
  updateMe,
};
