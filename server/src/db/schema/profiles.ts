import pgCore = require("drizzle-orm/pg-core");

const { foreignKey, index, pgEnum, pgSchema, pgTable, text, timestamp, uuid, boolean } = pgCore;

const authSchema = pgSchema("auth");
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

const profileRoleEnum = pgEnum("profile_role", ["student", "lecturer", "admin"]);

const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    email: text("email"),
    fullName: text("full_name"),
    role: profileRoleEnum("role").default("student"),
    isPro: boolean("is_pro").default(false),
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
    index("profiles_stripe_customer_id_idx").on(table.stripeCustomerId),
  ],
);

export = { profileRoleEnum, profiles };
