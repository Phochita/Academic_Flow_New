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
    status: text("status").default("submitted"),
    submissionText: text("submission_text"),
    submissionNote: text("submission_note"),
    fileUrl: text("file_url"),
    fileUrls: text("file_urls").array(),
    mediaUrls: text("media_urls").array(),
    linkUrls: text("link_urls").array(),
    submittedAt: timestamp("submitted_at", { withTimezone: true, mode: "date" }).defaultNow(),
    grade: numeric("grade", { precision: 5, scale: 2, mode: "number" }),
    feedback: text("feedback"),
    gradedAt: timestamp("graded_at", { withTimezone: true, mode: "date" }),
    returnedAt: timestamp("returned_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    uniqueIndex("submissions_assignment_student_uidx").on(table.assignmentId, table.studentId),
    index("submissions_assignment_id_idx").on(table.assignmentId),
    index("submissions_student_id_idx").on(table.studentId),
    index("submissions_status_idx").on(table.status),
  ],
);

export = { submissions };
