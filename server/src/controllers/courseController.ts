import drizzleOrm = require("drizzle-orm");
import expressTypes = require("express");
import zod = require("zod");
import dbModule = require("../db");
import schema = require("../db/schema");
import courseService = require("../services/course");
import profileService = require("../services/profile");
import httpUtils = require("../utils/http");

const { and, asc, desc, eq, ilike, or } = drizzleOrm;
const { z } = zod;
const { db } = dbModule;
const { assignments, courses, enrollments, materials, profiles } = schema;
const { ensureCourseAccess, getCourseById, getCourseStudents } = courseService;
const { getProfileById, normalizeRole } = profileService;
const { HttpError } = httpUtils;

const listCoursesQuerySchema = z.object({
  lecturerId: z.string().uuid().optional(),
  search: z.string().trim().min(1).max(120).optional(),
});

const courseIdParamsSchema = z.object({
  courseId: z.coerce.number().int().positive(),
});

const createCourseSchema = z.object({
  code: z.string().trim().min(3).max(20),
  description: z.string().trim().max(1000).nullish(),
  lecturerId: z.string().uuid().nullish(),
  name: z.string().trim().min(3).max(140),
});

const updateCourseSchema = z
  .object({
    code: z.string().trim().min(3).max(20).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
    lecturerId: z.string().uuid().nullable().optional(),
    name: z.string().trim().min(3).max(140).optional(),
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field must be provided.",
  });

const enrollStudentSchema = z.object({
  studentId: z.string().uuid(),
});

const createMaterialSchema = z.object({
  title: z.string().trim().min(3).max(160),
  type: z.string().trim().min(1).max(80).nullish(),
  url: z.url().trim().max(2000),
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

const serializeCourse = (row: {
  course: typeof courses.$inferSelect;
  lecturer: typeof profiles.$inferSelect | null;
}) => ({
  code: row.course.code,
  createdAt: row.course.createdAt,
  description: row.course.description,
  id: row.course.id,
  lecturer: row.lecturer
    ? {
        email: row.lecturer.email,
        fullName: row.lecturer.fullName,
        id: row.lecturer.id,
      }
    : null,
  lecturerId: row.course.lecturerId,
  name: row.course.name,
});

const serializeMaterial = (row: {
  material: typeof materials.$inferSelect;
  uploader: typeof profiles.$inferSelect | null;
}) => ({
  courseId: row.material.courseId,
  id: row.material.id,
  title: row.material.title,
  type: row.material.type,
  uploadedAt: row.material.uploadedAt,
  uploadedBy: row.material.uploadedBy,
  uploader: row.uploader
    ? {
        email: row.uploader.email,
        fullName: row.uploader.fullName,
        id: row.uploader.id,
      }
    : null,
  url: row.material.url,
});

const getCourseMaterials = async (courseId: number) =>
  db
    .select({
      material: materials,
      uploader: profiles,
    })
    .from(materials)
    .leftJoin(profiles, eq(materials.uploadedBy, profiles.id))
    .where(eq(materials.courseId, courseId))
    .orderBy(desc(materials.uploadedAt), desc(materials.id));

const listCourses = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const query = listCoursesQuerySchema.parse(req.query);
  const searchCondition = query.search
    ? or(ilike(courses.name, `%${query.search}%`), ilike(courses.code, `%${query.search}%`))
    : undefined;

  let rows: Array<{ course: typeof courses.$inferSelect; lecturer: typeof profiles.$inferSelect | null }>;

  if (req.auth.role === "student") {
    const conditions: any[] = [eq(enrollments.studentId, req.auth.userId)];

    if (searchCondition) {
      conditions.push(searchCondition);
    }

    const whereClause = combineConditions(conditions);
    const baseQuery = db
      .select({
        course: courses,
        lecturer: profiles,
      })
      .from(courses)
      .leftJoin(profiles, eq(courses.lecturerId, profiles.id))
      .innerJoin(enrollments, eq(enrollments.courseId, courses.id));

    rows = whereClause
      ? await baseQuery.where(whereClause).orderBy(desc(courses.createdAt))
      : await baseQuery.orderBy(desc(courses.createdAt));
  } else {
    const conditions: any[] = [];

    if (req.auth.role === "lecturer") {
      conditions.push(eq(courses.lecturerId, req.auth.userId));
    } else if (query.lecturerId) {
      conditions.push(eq(courses.lecturerId, query.lecturerId));
    }

    if (searchCondition) {
      conditions.push(searchCondition);
    }

    const whereClause = combineConditions(conditions);
    const baseQuery = db
      .select({
        course: courses,
        lecturer: profiles,
      })
      .from(courses)
      .leftJoin(profiles, eq(courses.lecturerId, profiles.id));

    rows = whereClause
      ? await baseQuery.where(whereClause).orderBy(desc(courses.createdAt))
      : await baseQuery.orderBy(desc(courses.createdAt));
  }

  res.status(200).json({
    courses: rows.map(serializeCourse),
  });
};

const getCourse = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const { courseId } = courseIdParamsSchema.parse(req.params);
  const courseRecord = await ensureCourseAccess(courseId, req.auth);
  const [assignmentRows, materialRows] = await Promise.all([
    db
      .select({
        dueDate: assignments.dueDate,
        id: assignments.id,
        maxScore: assignments.maxScore,
        title: assignments.title,
      })
      .from(assignments)
      .where(eq(assignments.courseId, courseId))
      .orderBy(asc(assignments.dueDate)),
    getCourseMaterials(courseId),
  ]);

  const studentRows =
    req.auth?.role === "student"
      ? []
      : (await getCourseStudents(courseId)).map((row) => ({
          email: row.student.email,
          enrolledAt: row.enrolledAt,
          fullName: row.student.fullName,
          id: row.student.id,
        }));

  res.status(200).json({
    assignments: assignmentRows,
    course: serializeCourse(courseRecord),
    materials: materialRows.map(serializeMaterial),
    students: studentRows,
  });
};

const createCourse = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const payload = createCourseSchema.parse(req.body);

  if (req.auth.role === "student") {
    throw new HttpError(403, "Students cannot create courses.");
  }

  const lecturerId = req.auth.role === "admin" ? payload.lecturerId ?? null : req.auth.userId;

  if (lecturerId) {
    const lecturerProfile = await getProfileById(lecturerId);

    if (!lecturerProfile) {
      throw new HttpError(404, "Lecturer profile not found.");
    }

    if (!["lecturer", "admin"].includes(normalizeRole(lecturerProfile.role))) {
      throw new HttpError(400, "The selected lecturer account is not allowed to own a course.");
    }
  }

  const [existingCourse] = await db.select({ id: courses.id }).from(courses).where(eq(courses.code, payload.code)).limit(1);

  if (existingCourse) {
    throw new HttpError(409, "A course with this code already exists.");
  }

  const [createdCourse] = await db
    .insert(courses)
    .values({
      code: payload.code,
      description: payload.description ?? null,
      lecturerId,
      name: payload.name,
    })
    .returning();

  const courseRecord = createdCourse ? await getCourseById(createdCourse.id) : null;

  res.status(201).json({
    course: courseRecord ? serializeCourse(courseRecord) : null,
    message: "Course created successfully.",
  });
};

const updateCourse = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const { courseId } = courseIdParamsSchema.parse(req.params);
  const payload = updateCourseSchema.parse(req.body);

  await ensureCourseAccess(courseId, req.auth, { requireManager: true });

  if (payload.lecturerId !== undefined && req.auth.role !== "admin") {
    throw new HttpError(403, "Only admins can reassign a course lecturer.");
  }

  if (payload.code) {
    const [duplicateCourse] = await db.select({ id: courses.id }).from(courses).where(eq(courses.code, payload.code)).limit(1);

    if (duplicateCourse && duplicateCourse.id !== courseId) {
      throw new HttpError(409, "A course with this code already exists.");
    }
  }

  if (payload.lecturerId) {
    const lecturerProfile = await getProfileById(payload.lecturerId);

    if (!lecturerProfile) {
      throw new HttpError(404, "Lecturer profile not found.");
    }

    if (!["lecturer", "admin"].includes(normalizeRole(lecturerProfile.role))) {
      throw new HttpError(400, "The selected lecturer account is not allowed to own a course.");
    }
  }

  const [updatedCourse] = await db
    .update(courses)
    .set({
      code: payload.code,
      description: payload.description,
      lecturerId: payload.lecturerId,
      name: payload.name,
    })
    .where(eq(courses.id, courseId))
    .returning();

  const courseRecord = updatedCourse ? await getCourseById(updatedCourse.id) : null;

  res.status(200).json({
    course: courseRecord ? serializeCourse(courseRecord) : null,
    message: "Course updated successfully.",
  });
};

const listCourseStudents = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const { courseId } = courseIdParamsSchema.parse(req.params);

  await ensureCourseAccess(courseId, req.auth, { requireManager: true });

  const students = await getCourseStudents(courseId);

  res.status(200).json({
    students: students.map((row) => ({
      email: row.student.email,
      enrolledAt: row.enrolledAt,
      fullName: row.student.fullName,
      id: row.student.id,
      role: normalizeRole(row.student.role),
    })),
  });
};

const enrollStudent = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const { courseId } = courseIdParamsSchema.parse(req.params);
  const payload = enrollStudentSchema.parse(req.body);

  await ensureCourseAccess(courseId, req.auth, { requireManager: true });

  const studentProfile = await getProfileById(payload.studentId);

  if (!studentProfile) {
    throw new HttpError(404, "Student profile not found.");
  }

  if (normalizeRole(studentProfile.role) !== "student") {
    throw new HttpError(400, "Only student accounts can be enrolled in a course.");
  }

  const [createdEnrollment] = await db
    .insert(enrollments)
    .values({
      courseId,
      studentId: payload.studentId,
    })
    .onConflictDoNothing({
      target: [enrollments.courseId, enrollments.studentId],
    })
    .returning();

  res.status(createdEnrollment ? 201 : 200).json({
    enrollment: createdEnrollment ?? null,
    message: createdEnrollment ? "Student enrolled successfully." : "Student is already enrolled in this course.",
  });
};

const listCourseMaterials = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const { courseId } = courseIdParamsSchema.parse(req.params);

  await ensureCourseAccess(courseId, req.auth);

  const materialRows = await getCourseMaterials(courseId);

  res.status(200).json({
    materials: materialRows.map(serializeMaterial),
  });
};

const createCourseMaterial = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const { courseId } = courseIdParamsSchema.parse(req.params);
  const payload = createMaterialSchema.parse(req.body);

  await ensureCourseAccess(courseId, req.auth, { requireManager: true });

  const [createdMaterial] = await db
    .insert(materials)
    .values({
      courseId,
      title: payload.title,
      type: payload.type ?? null,
      uploadedBy: req.auth.userId,
      url: payload.url,
    })
    .returning();

  const materialRows = createdMaterial ? await getCourseMaterials(courseId) : [];
  const material = createdMaterial ? materialRows.find((row) => row.material.id === createdMaterial.id) ?? null : null;

  res.status(201).json({
    material: material ? serializeMaterial(material) : null,
    message: "Course material uploaded successfully.",
  });
};

export = {
  createCourseMaterial,
  createCourse,
  enrollStudent,
  getCourse,
  listCourseMaterials,
  listCourses,
  listCourseStudents,
  updateCourse,
};
