import pgCore = require("drizzle-orm/pg-core");
import assignmentsSchema = require("./assignments");
import profilesSchema = require("./profiles");

const { assignments } = assignmentsSchema;
const { profiles } = profilesSchema;
const { bigint, bigserial, index, numeric, pgTable, text, timestamp, uniqueIndex, uuid } = pgCore;

const submissions = pgTable(
  "submissions",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    assignmentId: bigint("assignment_id", { mode: "number" }).references(() => assignments.id, { onDelete: "cascade" }),
    studentId: uuid("student_id").references(() => profiles.id, { onDelete: "cascade" }),
    submissionText: text("submission_text"),
    fileUrl: text("file_url"),
    submittedAt: timestamp("submitted_at", { withTimezone: true, mode: "date" }).defaultNow(),
    grade: numeric("grade", { precision: 5, scale: 2, mode: "number" }),
    gradedAt: timestamp("graded_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("submissions_assignment_student_uidx").on(table.assignmentId, table.studentId),
    index("submissions_assignment_id_idx").on(table.assignmentId),
    index("submissions_student_id_idx").on(table.studentId),
  ],
);

export = { submissions };
