import pgCore = require("drizzle-orm/pg-core");
import profilesSchema = require("./profiles");

const { profiles } = profilesSchema;
const { bigserial, index, pgEnum, pgTable, text, timestamp, uuid } = pgCore;

const reportCategoryEnum = pgEnum("report_category", ["moderation", "billing", "academic_integrity", "operations"]);
const reportStatusEnum = pgEnum("report_status", ["open", "in_review", "resolved"]);

const reports = pgTable(
  "reports",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    title: text("title").notNull(),
    ownerId: uuid("owner_id").references(() => profiles.id),
    ownerLabel: text("owner_label"),
    category: reportCategoryEnum("category").default("operations"),
    status: reportStatusEnum("status").default("open"),
    summary: text("summary"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: "date" }),
    resolvedBy: uuid("resolved_by").references(() => profiles.id),
  },
  (table) => [
    index("reports_owner_id_idx").on(table.ownerId),
    index("reports_status_idx").on(table.status),
    index("reports_category_idx").on(table.category),
    index("reports_updated_at_idx").on(table.updatedAt),
  ],
);

export = { reports, reportCategoryEnum, reportStatusEnum };
