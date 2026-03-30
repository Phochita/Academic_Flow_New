import pgCore = require("drizzle-orm/pg-core");
import coursesSchema = require("./courses");
import profilesSchema = require("./profiles");

const { courses } = coursesSchema;
const { profiles } = profilesSchema;
const { bigint, bigserial, index, pgTable, timestamp, uniqueIndex, uuid } = pgCore;

const enrollments = pgTable(
  "enrollments",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id, { onDelete: "cascade" }),
    studentId: uuid("student_id").references(() => profiles.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    uniqueIndex("enrollments_course_student_uidx").on(table.courseId, table.studentId),
    index("enrollments_course_id_idx").on(table.courseId),
    index("enrollments_student_id_idx").on(table.studentId),
  ],
);

export = { enrollments };
