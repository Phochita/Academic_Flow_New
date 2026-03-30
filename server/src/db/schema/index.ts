import drizzleOrm = require("drizzle-orm");
import assignmentsSchema = require("./assignments");
import attendanceSchema = require("./attendance");
import coursesSchema = require("./courses");
import enrollmentsSchema = require("./enrollments");
import materialsSchema = require("./materials");
import profilesSchema = require("./profiles");
import submissionsSchema = require("./submissions");
import subscriptionsSchema = require("./subscriptions");

const { relations } = drizzleOrm;

const { assignments } = assignmentsSchema;
const { attendance, attendanceStatusEnum } = attendanceSchema;
const { courses } = coursesSchema;
const { enrollments } = enrollmentsSchema;
const { materials } = materialsSchema;
const { profiles, profileRoleEnum } = profilesSchema;
const { submissions } = submissionsSchema;
const { subscriptions, subscriptionStatusEnum } = subscriptionsSchema;

const profilesRelations = relations(profiles, ({ many }) => ({
  taughtCourses: many(courses, { relationName: "courseLecturer" }),
  enrollments: many(enrollments),
  submissions: many(submissions),
  attendanceRecords: many(attendance, { relationName: "attendanceStudent" }),
  markedAttendanceRecords: many(attendance, { relationName: "attendanceMarker" }),
  uploadedMaterials: many(materials),
  subscriptions: many(subscriptions),
}));

const coursesRelations = relations(courses, ({ many, one }) => ({
  lecturer: one(profiles, {
    fields: [courses.lecturerId],
    references: [profiles.id],
    relationName: "courseLecturer",
  }),
  enrollments: many(enrollments),
  assignments: many(assignments),
  attendanceRecords: many(attendance),
  materials: many(materials),
}));

const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  student: one(profiles, {
    fields: [enrollments.studentId],
    references: [profiles.id],
  }),
}));

const assignmentsRelations = relations(assignments, ({ many, one }) => ({
  course: one(courses, {
    fields: [assignments.courseId],
    references: [courses.id],
  }),
  submissions: many(submissions),
}));

const submissionsRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(profiles, {
    fields: [submissions.studentId],
    references: [profiles.id],
  }),
}));

const attendanceRelations = relations(attendance, ({ one }) => ({
  course: one(courses, {
    fields: [attendance.courseId],
    references: [courses.id],
  }),
  student: one(profiles, {
    fields: [attendance.studentId],
    references: [profiles.id],
    relationName: "attendanceStudent",
  }),
  marker: one(profiles, {
    fields: [attendance.markedBy],
    references: [profiles.id],
    relationName: "attendanceMarker",
  }),
}));

const materialsRelations = relations(materials, ({ one }) => ({
  course: one(courses, {
    fields: [materials.courseId],
    references: [courses.id],
  }),
  uploader: one(profiles, {
    fields: [materials.uploadedBy],
    references: [profiles.id],
  }),
}));

const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(profiles, {
    fields: [subscriptions.userId],
    references: [profiles.id],
  }),
}));

export = {
  assignments,
  assignmentsRelations,
  attendance,
  attendanceRelations,
  attendanceStatusEnum,
  courses,
  coursesRelations,
  enrollments,
  enrollmentsRelations,
  materials,
  materialsRelations,
  profileRoleEnum,
  profiles,
  profilesRelations,
  submissions,
  submissionsRelations,
  subscriptions,
  subscriptionsRelations,
  subscriptionStatusEnum,
};
