import pgCore = require("drizzle-orm/pg-core");

const { boolean, foreignKey, index, integer, numeric, pgEnum, pgSchema, pgTable, text, timestamp, uuid } = pgCore;

const authSchema = pgSchema("auth");
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

const profileRoleEnum = pgEnum("profile_role", ["student", "lecturer", "admin"]);
const profileStatusEnum = pgEnum("profile_status", ["active", "pending_review", "suspended"]);

const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    email: text("email"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    fullName: text("full_name"),
    role: profileRoleEnum("role").default("student"),
    status: profileStatusEnum("status").default("active"),
    isPro: boolean("is_pro").default(false),
    avatarUrl: text("avatar_url"),
    phoneNumber: text("phone_number"),
    address: text("address"),
    department: text("department"),
    batch: text("batch"),
    classYear: integer("class_year"),
    academicBio: text("academic_bio"),
    currentGpa: numeric("current_gpa", { precision: 4, scale: 2, mode: "number" }),
    earnedCredits: integer("earned_credits"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true, mode: "date" }),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
      name: "profiles_auth_user_id_fk",
    }).onDelete("cascade"),
    index("profiles_role_idx").on(table.role),
    index("profiles_status_idx").on(table.status),
    index("profiles_department_idx").on(table.department),
    index("profiles_stripe_customer_id_idx").on(table.stripeCustomerId),
  ],
);

export = { profileRoleEnum, profileStatusEnum, profiles };
