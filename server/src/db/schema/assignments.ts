import pgCore = require("drizzle-orm/pg-core");
import coursesSchema = require("./courses");

const { courses } = coursesSchema;
const { bigint, bigserial, index, integer, numeric, pgTable, text, timestamp } = pgCore;

const assignments = pgTable(
  "assignments",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    assignmentType: text("assignment_type").default("assignment"),
    topic: text("topic"),
    summary: text("summary"),
    description: text("description"),
    instructions: text("instructions").array(),
    dueDate: timestamp("due_date", { withTimezone: true, mode: "date" }).notNull(),
    maxScore: numeric("max_score", { precision: 5, scale: 2, mode: "number" }),
    flaggedCount: integer("flagged_count").default(0),
    status: text("status").default("on_track"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    index("assignments_course_id_idx").on(table.courseId),
    index("assignments_due_date_idx").on(table.dueDate),
    index("assignments_status_idx").on(table.status),
  ],
);

export = { assignments };
