import pgCore = require("drizzle-orm/pg-core");
import profilesSchema = require("./profiles");

const { profiles } = profilesSchema;
const { bigserial, index, pgEnum, pgTable, text, timestamp, uuid } = pgCore;

const activitySeverityEnum = pgEnum("activity_severity", ["info", "warning", "critical"]);

const activityLogs = pgTable(
  "activity_logs",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    actorId: uuid("actor_id").references(() => profiles.id),
    actorLabel: text("actor_label"),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    targetLabel: text("target_label"),
    severity: activitySeverityEnum("severity").default("info"),
    details: text("details"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("activity_logs_actor_id_idx").on(table.actorId),
    index("activity_logs_severity_idx").on(table.severity),
    index("activity_logs_created_at_idx").on(table.createdAt),
  ],
);

export = { activityLogs, activitySeverityEnum };
