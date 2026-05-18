import drizzleOrm = require("drizzle-orm");
import dbModule = require("../db");
import schema = require("../db/schema");

const { eq } = drizzleOrm;
const { db } = dbModule;
const { profiles } = schema;

type AppRole = "student" | "lecturer" | "admin";

type AuthLikeUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

type SyncProfileInput = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  fullName?: string | null;
  lastName?: string | null;
  role?: AppRole;
};

type UpdateProfileInput = {
  academicBio?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  batch?: string | null;
  classYear?: number | null;
  currentGpa?: number | null;
  department?: string | null;
  earnedCredits?: number | null;
  firstName?: string | null;
  fullName?: string | null;
  lastName?: string | null;
  lastSeenAt?: Date | null;
  phoneNumber?: string | null;
  status?: "active" | "pending_review" | "suspended" | null;
};

const VALID_ROLES = new Set<AppRole>(["student", "lecturer", "admin"]);

const normalizeRole = (value: unknown): AppRole => {
  if (typeof value !== "string") {
    return "student";
  }

  const normalizedValue = value.trim().toLowerCase();

  if (VALID_ROLES.has(normalizedValue as AppRole)) {
    return normalizedValue as AppRole;
  }

  return "student";
};

const buildFullName = (parts: Array<string | null | undefined>) => {
  const normalizedParts = parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  return normalizedParts.length > 0 ? normalizedParts.join(" ") : null;
};

const getProfileById = async (userId: string) => {
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);

  return profile ?? null;
};

const syncProfile = async ({ id, email, firstName, fullName, lastName, role }: SyncProfileInput) => {
  const existingProfile = await getProfileById(id);

  const nextRole = role ?? normalizeRole(existingProfile?.role);
  const nextEmail = email ?? existingProfile?.email ?? null;
  const nextFirstName = firstName ?? existingProfile?.firstName ?? null;
  const nextFullName = fullName ?? existingProfile?.fullName ?? null;
  const nextLastName = lastName ?? existingProfile?.lastName ?? null;

  if (!existingProfile) {
    const [createdProfile] = await db
      .insert(profiles)
      .values({
        id,
        email: nextEmail,
        firstName: nextFirstName,
        fullName: nextFullName,
        lastName: nextLastName,
        role: nextRole,
      })
      .returning();

    return createdProfile ?? null;
  }

  const shouldUpdate =
    existingProfile.email !== nextEmail ||
    existingProfile.firstName !== nextFirstName ||
    existingProfile.fullName !== nextFullName ||
    existingProfile.lastName !== nextLastName ||
    normalizeRole(existingProfile.role) !== nextRole;

  if (!shouldUpdate) {
    return existingProfile;
  }

  const [updatedProfile] = await db
    .update(profiles)
    .set({
      email: nextEmail,
      firstName: nextFirstName,
      fullName: nextFullName,
      lastName: nextLastName,
      role: nextRole,
    })
    .where(eq(profiles.id, id))
    .returning();

  return updatedProfile ?? existingProfile;
};

const syncProfileFromAuthUser = async (user: AuthLikeUser) => {
  const userMetadata = user.user_metadata ?? {};
  const fullName =
    (typeof userMetadata.full_name === "string" ? userMetadata.full_name : null) ??
    buildFullName([
      typeof userMetadata.first_name === "string" ? userMetadata.first_name : null,
      typeof userMetadata.last_name === "string" ? userMetadata.last_name : null,
    ]);
  const firstName = typeof userMetadata.first_name === "string" ? userMetadata.first_name : null;
  const lastName = typeof userMetadata.last_name === "string" ? userMetadata.last_name : null;

  return syncProfile({
    id: user.id,
    email: user.email ?? null,
    firstName,
    fullName,
    lastName,
    role: normalizeRole(userMetadata.role),
  });
};

const updateProfileById = async (userId: string, updates: UpdateProfileInput) => {
  const existingProfile = await getProfileById(userId);

  if (!existingProfile) {
    return null;
  }

  const nextValues: UpdateProfileInput = {};

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      Object.assign(nextValues, { [key]: value });
    }
  }

  if (Object.keys(nextValues).length === 0) {
    return existingProfile;
  }

  const [updatedProfile] = await db
    .update(profiles)
    .set(nextValues)
    .where(eq(profiles.id, userId))
    .returning();

  return updatedProfile ?? existingProfile;
};

export = {
  buildFullName,
  getProfileById,
  normalizeRole,
  syncProfile,
  syncProfileFromAuthUser,
  updateProfileById,
};
