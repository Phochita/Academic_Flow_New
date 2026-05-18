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

const forgotPasswordSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8).max(128),
});

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
});

const formatUser = (profile: Awaited<ReturnType<typeof getProfileById>>, fallbackEmail?: string | null) => ({
  avatarUrl: profile?.avatarUrl ?? null,
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

const getPasswordResetRedirectUrl = () => {
  const appUrl = [
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ]
    .map((value) => value?.trim())
    .find(Boolean);

  if (!appUrl) {
    return undefined;
  }

  try {
    return new URL("/reset-password", appUrl).toString();
  } catch {
    return undefined;
  }
};

const getEmailConfirmationRedirectUrl = () => {
  const appUrl = [
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ]
    .map((value) => value?.trim())
    .find(Boolean);

  if (!appUrl) {
    return undefined;
  }

  try {
    return new URL("/auth/confirm", appUrl).toString();
  } catch {
    return undefined;
  }
};

const isAuthServiceFetchError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  if (error.message.trim().toLowerCase() === "fetch failed") {
    return true;
  }

  const cause = (error as Error & { cause?: { code?: string } }).cause;
  const causeCode = typeof cause?.code === "string" ? cause.code.toUpperCase() : "";

  return ["EACCES", "ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT"].includes(causeCode);
};

const toAuthServiceError = (error: unknown) => {
  if (isAuthServiceFetchError(error)) {
    return new HttpError(
      503,
      "Authentication service is unavailable right now. Check your Supabase URL, keys, and network connection, then try again.",
    );
  }

  return error;
};

const register = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const payload = registerSchema.parse(req.body);
  if (payload.role === "admin") {
    throw new HttpError(403, "Admin accounts can only be created internally.");
  }

  const role = payload.role;
  const fullName = buildFullName([payload.firstName, payload.lastName]);
  const supabase = createSupabaseClient();
  const emailRedirectTo = getEmailConfirmationRedirectUrl();

  let data;
  let error;

  try {
    ({ data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          first_name: payload.firstName,
          last_name: payload.lastName,
          full_name: fullName,
          role,
        },
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    }));
  } catch (signupError) {
    throw toAuthServiceError(signupError);
  }

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
      role,
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

  let data;
  let error;

  try {
    ({ data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    }));
  } catch (loginError) {
    throw toAuthServiceError(loginError);
  }

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

const forgotPassword = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const payload = forgotPasswordSchema.parse(req.body);
  const supabase = createSupabaseClient();
  const redirectTo = getPasswordResetRedirectUrl();

  let error;

  try {
    ({ error } = await supabase.auth.resetPasswordForEmail(
      payload.email,
      redirectTo ? { redirectTo } : undefined,
    ));
  } catch (resetRequestError) {
    throw toAuthServiceError(resetRequestError);
  }

  if (error) {
    throw new HttpError(400, error.message ?? "Unable to send a password reset email right now.");
  }

  res.status(200).json({
    message: "If an account exists for this email, a password reset link has been sent.",
  });
};

const resetPassword = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const payload = resetPasswordSchema.parse(req.body);
  let error;

  try {
    ({ error } = await supabaseUtils.supabaseAdmin.auth.admin.updateUserById(req.auth.userId, {
      password: payload.password,
    }));
  } catch (passwordUpdateError) {
    throw toAuthServiceError(passwordUpdateError);
  }

  if (error) {
    throw new HttpError(400, error.message ?? "Unable to update your password right now.");
  }

  res.status(200).json({
    message: "Password updated successfully. You can now sign in with your new password.",
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
  forgotPassword,
  getMe,
  login,
  register,
  resetPassword,
  updateMe,
};
