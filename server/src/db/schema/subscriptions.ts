import pgCore = require("drizzle-orm/pg-core");
import profilesSchema = require("./profiles");

const { profiles } = profilesSchema;
const { bigserial, index, pgEnum, pgTable, text, timestamp, uuid } = pgCore;

const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "expired", "cancelled"]);

const subscriptions = pgTable(
  "subscriptions",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
    plan: text("plan"),
    startDate: timestamp("start_date", { withTimezone: true, mode: "date" }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true, mode: "date" }).notNull(),
    stripeSubscriptionId: text("stripe_subscription_id"),
    status: subscriptionStatusEnum("status").default("active"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_status_idx").on(table.status),
    index("subscriptions_stripe_subscription_id_idx").on(table.stripeSubscriptionId),
  ],
);

export = { subscriptions, subscriptionStatusEnum };
