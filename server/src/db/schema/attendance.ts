import pgCore = require("drizzle-orm/pg-core");
import coursesSchema = require("./courses");
import profilesSchema = require("./profiles");

const { courses } = coursesSchema;
const { profiles } = profilesSchema;
const { bigint, bigserial, date, index, pgEnum, pgTable, timestamp, uniqueIndex, uuid } = pgCore;

const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent"]);

const attendance = pgTable(
  "attendance",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id, { onDelete: "cascade" }),
    studentId: uuid("student_id").references(() => profiles.id, { onDelete: "cascade" }),
    attendanceDate: date("date", { mode: "string" }).notNull(),
    status: attendanceStatusEnum("status"),
    markedBy: uuid("marked_by").references(() => profiles.id),
    markedAt: timestamp("marked_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    uniqueIndex("attendance_course_student_date_uidx").on(table.courseId, table.studentId, table.attendanceDate),
    index("attendance_course_id_idx").on(table.courseId),
    index("attendance_student_id_idx").on(table.studentId),
    index("attendance_marked_by_idx").on(table.markedBy),
    index("attendance_date_idx").on(table.attendanceDate),
  ],
);

export = { attendance, attendanceStatusEnum };
