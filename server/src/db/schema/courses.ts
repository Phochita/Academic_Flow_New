import pgCore = require("drizzle-orm/pg-core");
import profilesSchema = require("./profiles");

const { profiles } = profilesSchema;
const { bigserial, index, numeric, pgTable, text, timestamp, uuid } = pgCore;

const courses = pgTable(
  "courses",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    section: text("section"),
    subject: text("subject"),
    room: text("room"),
    schedule: text("schedule"),
    semester: text("semester"),
    program: text("program"),
    status: text("status").default("active"),
    healthStatus: text("health_status").default("healthy"),
    completionRate: numeric("completion_rate", { precision: 5, scale: 2, mode: "number" }),
    lecturerId: uuid("lecturer_id").references(() => profiles.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("courses_lecturer_id_idx").on(table.lecturerId),
    index("courses_name_idx").on(table.name),
    index("courses_status_idx").on(table.status),
    index("courses_health_status_idx").on(table.healthStatus),
  ],
);

export = { courses };
