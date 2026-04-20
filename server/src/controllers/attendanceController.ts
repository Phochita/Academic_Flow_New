import drizzleOrm = require("drizzle-orm");
import expressTypes = require("express");
import zod = require("zod");
import dbModule = require("../db");
import schema = require("../db/schema");
import courseService = require("../services/course");
import httpUtils = require("../utils/http");

const { and, asc, desc, eq, gte, inArray, lte } = drizzleOrm;
const { z } = zod;
const { db } = dbModule;
const { attendance, courses, enrollments, profiles } = schema;
const { ensureCourseAccess } = courseService;
const { HttpError } = httpUtils;

type AttendanceFilters = {
  courseId?: number | undefined;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
  studentId?: string | undefined;
};

const attendanceQuerySchema = z.object({
  courseId: z.coerce.number().int().positive().optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  studentId: z.string().uuid().optional(),
});

const markAttendanceSchema = z.object({
  attendanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  courseId: z.coerce.number().int().positive(),
  records: z
    .array(
      z.object({
        status: z.enum(["present", "absent"]),
        studentId: z.string().uuid(),
      }),
    )
    .min(1),
});

const combineConditions = (conditions: any[]) => {
  if (conditions.length === 0) {
    return undefined;
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return and(...conditions);
};

const fetchAttendanceRows = async (
  auth: NonNullable<expressTypes.Request["auth"]>,
  filters: AttendanceFilters,
) => {
  const conditions: any[] = [];
  const baseQuery = db
    .select({
      course: courses,
      record: attendance,
      student: profiles,
    })
    .from(attendance)
    .innerJoin(courses, eq(attendance.courseId, courses.id))
    .innerJoin(profiles, eq(attendance.studentId, profiles.id));

  if (auth.role === "student") {
    conditions.push(eq(attendance.studentId, auth.userId));
  } else if (auth.role === "lecturer") {
    conditions.push(eq(courses.lecturerId, auth.userId));
  }

  if (filters.courseId) {
    conditions.push(eq(attendance.courseId, filters.courseId));
  }

  if (filters.studentId) {
    if (auth.role === "student" && filters.studentId !== auth.userId) {
      throw new HttpError(403, "Students can only view their own attendance.");
    }

    conditions.push(eq(attendance.studentId, filters.studentId));
  }

  if (filters.dateFrom) {
    conditions.push(gte(attendance.attendanceDate, filters.dateFrom));
  }

  if (filters.dateTo) {
    conditions.push(lte(attendance.attendanceDate, filters.dateTo));
  }

  const whereClause = combineConditions(conditions);

  return whereClause
    ? baseQuery.where(whereClause).orderBy(desc(attendance.attendanceDate), asc(courses.name))
    : baseQuery.orderBy(desc(attendance.attendanceDate), asc(courses.name));
};

const listAttendance = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const query = attendanceQuerySchema.parse(req.query);
  const rows = await fetchAttendanceRows(req.auth, query);

  res.status(200).json({
    attendance: rows.map((row) => ({
      attendanceDate: row.record.attendanceDate,
      course: {
        code: row.course.code,
        id: row.course.id,
        name: row.course.name,
      },
      id: row.record.id,
      markedAt: row.record.markedAt,
      markedBy: row.record.markedBy,
      status: row.record.status,
      student: {
        email: row.student.email,
        fullName: row.student.fullName,
        id: row.student.id,
      },
    })),
  });
};

const getAttendanceSummary = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const query = attendanceQuerySchema.parse(req.query);
  const rows = await fetchAttendanceRows(req.auth, query);
  const summaryMap = new Map<
    number,
    {
      absent: number;
      courseCode: string;
      courseId: number;
      courseName: string;
      present: number;
      total: number;
    }
  >();

  for (const row of rows) {
    const current = summaryMap.get(row.course.id) ?? {
      absent: 0,
      courseCode: row.course.code,
      courseId: row.course.id,
      courseName: row.course.name,
      present: 0,
      total: 0,
    };

    current.total += 1;

    if (row.record.status === "present") {
      current.present += 1;
    } else if (row.record.status === "absent") {
      current.absent += 1;
    }

    summaryMap.set(row.course.id, current);
  }

  const summary = Array.from(summaryMap.values()).map((item) => ({
    ...item,
    attendancePercentage: item.total > 0 ? Math.round((item.present / item.total) * 100) : 0,
  }));

  res.status(200).json({
    summary,
  });
};

const markAttendance = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const payload = markAttendanceSchema.parse(req.body);

  await ensureCourseAccess(payload.courseId, req.auth, { requireManager: true });

  const studentIds = payload.records.map((record) => record.studentId);
  const uniqueStudentIds = new Set(studentIds);

  if (uniqueStudentIds.size !== studentIds.length) {
    throw new HttpError(400, "Each student can only appear once in an attendance request.");
  }

  const enrolledStudents = await db
    .select({ studentId: enrollments.studentId })
    .from(enrollments)
    .where(and(eq(enrollments.courseId, payload.courseId), inArray(enrollments.studentId, studentIds)));

  if (enrolledStudents.length !== studentIds.length) {
    throw new HttpError(400, "Attendance can only be recorded for enrolled students.");
  }

  for (const record of payload.records) {
    await db
      .insert(attendance)
      .values({
        attendanceDate: payload.attendanceDate,
        courseId: payload.courseId,
        markedAt: new Date(),
        markedBy: req.auth.userId,
        status: record.status,
        studentId: record.studentId,
      })
      .onConflictDoUpdate({
        set: {
          markedAt: new Date(),
          markedBy: req.auth.userId,
          status: record.status,
        },
        target: [attendance.courseId, attendance.studentId, attendance.attendanceDate],
      });
  }

  const rows = await fetchAttendanceRows(req.auth, {
    courseId: payload.courseId,
    dateFrom: payload.attendanceDate,
    dateTo: payload.attendanceDate,
  });

  res.status(200).json({
    attendance: rows.map((row) => ({
      attendanceDate: row.record.attendanceDate,
      id: row.record.id,
      status: row.record.status,
      student: {
        fullName: row.student.fullName,
        id: row.student.id,
      },
    })),
    message: "Attendance recorded successfully.",
  });
};

export = {
  getAttendanceSummary,
  listAttendance,
  markAttendance,
};
