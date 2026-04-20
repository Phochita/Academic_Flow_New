import drizzleOrm = require("drizzle-orm");
import dbModule = require("../db");
import schema = require("../db/schema");
import httpUtils = require("../utils/http");

const { and, eq } = drizzleOrm;
const { db } = dbModule;
const { courses, enrollments, profiles } = schema;
const { HttpError } = httpUtils;

type AuthContext = {
  userId: string;
  role: "student" | "lecturer" | "admin";
};

const getCourseById = async (courseId: number) => {
  const [courseRecord] = await db
    .select({
      course: courses,
      lecturer: profiles,
    })
    .from(courses)
    .leftJoin(profiles, eq(courses.lecturerId, profiles.id))
    .where(eq(courses.id, courseId))
    .limit(1);

  return courseRecord ?? null;
};

const isStudentEnrolled = async (courseId: number, studentId: string) => {
  const [enrollmentRecord] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(and(eq(enrollments.courseId, courseId), eq(enrollments.studentId, studentId)))
    .limit(1);

  return Boolean(enrollmentRecord);
};

const ensureCourseAccess = async (
  courseId: number,
  auth: AuthContext | undefined,
  options?: { requireManager?: boolean },
) => {
  if (!auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const courseRecord = await getCourseById(courseId);

  if (!courseRecord) {
    throw new HttpError(404, "Course not found.");
  }

  if (auth.role === "admin") {
    return courseRecord;
  }

  const lecturerOwnsCourse = courseRecord.course.lecturerId === auth.userId;

  if (options?.requireManager) {
    if (!lecturerOwnsCourse) {
      throw new HttpError(403, "You do not have permission to manage this course.");
    }

    return courseRecord;
  }

  if (auth.role === "lecturer") {
    if (!lecturerOwnsCourse) {
      throw new HttpError(403, "You do not have permission to access this course.");
    }

    return courseRecord;
  }

  if (auth.role === "student") {
    const enrolled = await isStudentEnrolled(courseId, auth.userId);

    if (!enrolled) {
      throw new HttpError(403, "You are not enrolled in this course.");
    }

    return courseRecord;
  }

  throw new HttpError(403, "You do not have permission to access this course.");
};

const getCourseStudents = async (courseId: number) =>
  db
    .select({
      enrollmentId: enrollments.id,
      enrolledAt: enrollments.enrolledAt,
      student: profiles,
    })
    .from(enrollments)
    .innerJoin(profiles, eq(enrollments.studentId, profiles.id))
    .where(eq(enrollments.courseId, courseId));

export = {
  ensureCourseAccess,
  getCourseById,
  getCourseStudents,
  isStudentEnrolled,
};
