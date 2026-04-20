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
  fullName?: string | null;
  role?: AppRole;
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

const syncProfile = async ({ id, email, fullName, role }: SyncProfileInput) => {
  const existingProfile = await getProfileById(id);

  const nextRole = role ?? normalizeRole(existingProfile?.role);
  const nextEmail = email ?? existingProfile?.email ?? null;
  const nextFullName = fullName ?? existingProfile?.fullName ?? null;

  if (!existingProfile) {
    const [createdProfile] = await db
      .insert(profiles)
      .values({
        id,
        email: nextEmail,
        fullName: nextFullName,
        role: nextRole,
      })
      .returning();

    return createdProfile ?? null;
  }

  const shouldUpdate =
    existingProfile.email !== nextEmail ||
    existingProfile.fullName !== nextFullName ||
    normalizeRole(existingProfile.role) !== nextRole;

  if (!shouldUpdate) {
    return existingProfile;
  }

  const [updatedProfile] = await db
    .update(profiles)
    .set({
      email: nextEmail,
      fullName: nextFullName,
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

  return syncProfile({
    id: user.id,
    email: user.email ?? null,
    fullName,
    role: normalizeRole(userMetadata.role),
  });
};

export = {
  buildFullName,
  getProfileById,
  normalizeRole,
  syncProfile,
  syncProfileFromAuthUser,
};
