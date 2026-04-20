import drizzleOrm = require("drizzle-orm");
import expressTypes = require("express");
import zod = require("zod");
import dbModule = require("../db");
import schema = require("../db/schema");
import courseService = require("../services/course");
import httpUtils = require("../utils/http");

const { and, asc, desc, eq } = drizzleOrm;
const { z } = zod;
const { db } = dbModule;
const { assignments, courses, enrollments, profiles, submissions } = schema;
const { ensureCourseAccess, isStudentEnrolled } = courseService;
const { HttpError } = httpUtils;

const assignmentIdParamsSchema = z.object({
  assignmentId: z.coerce.number().int().positive(),
});

const assignmentListQuerySchema = z.object({
  courseId: z.coerce.number().int().positive().optional(),
});

const createAssignmentSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  description: z.string().trim().max(2000).nullish(),
  dueDate: z.iso.datetime(),
  maxScore: z.number().min(0).max(1000).nullish(),
  title: z.string().trim().min(3).max(160),
});

const updateAssignmentSchema = z
  .object({
    description: z.string().trim().max(2000).nullable().optional(),
    dueDate: z.iso.datetime().optional(),
    maxScore: z.number().min(0).max(1000).nullable().optional(),
    title: z.string().trim().min(3).max(160).optional(),
  })
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field must be provided.",
  });

const submitAssignmentSchema = z
  .object({
    fileUrl: z.url().trim().max(2000).optional(),
    studentId: z.string().uuid().optional(),
    submissionText: z.string().trim().max(10000).optional(),
  })
  .refine((value) => Boolean(value.fileUrl || value.submissionText), {
    message: "Provide submission text, a file URL, or both.",
  });

const gradeSubmissionParamsSchema = z.object({
  assignmentId: z.coerce.number().int().positive(),
  submissionId: z.coerce.number().int().positive(),
});

const gradeSubmissionSchema = z.object({
  grade: z.number().min(0).max(1000),
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

const getAssignmentRecord = async (assignmentId: number) => {
  const [assignmentRecord] = await db
    .select({
      assignment: assignments,
      course: courses,
    })
    .from(assignments)
    .innerJoin(courses, eq(assignments.courseId, courses.id))
    .where(eq(assignments.id, assignmentId))
    .limit(1);

  return assignmentRecord ?? null;
};

const serializeAssignment = (row: {
  assignment: typeof assignments.$inferSelect;
  course: typeof courses.$inferSelect;
}) => ({
  course: {
    code: row.course.code,
    id: row.course.id,
    name: row.course.name,
  },
  courseId: row.assignment.courseId,
  createdAt: row.assignment.createdAt,
  description: row.assignment.description,
  dueDate: row.assignment.dueDate,
  id: row.assignment.id,
  maxScore: row.assignment.maxScore,
  title: row.assignment.title,
});

const listAssignments = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const query = assignmentListQuerySchema.parse(req.query);
  const conditions: any[] = [];

  let baseQuery = db
    .select({
      assignment: assignments,
      course: courses,
    })
    .from(assignments)
    .innerJoin(courses, eq(assignments.courseId, courses.id));

  if (req.auth.role === "student") {
    baseQuery = baseQuery.innerJoin(enrollments, eq(enrollments.courseId, courses.id));
    conditions.push(eq(enrollments.studentId, req.auth.userId));
  } else if (req.auth.role === "lecturer") {
    conditions.push(eq(courses.lecturerId, req.auth.userId));
  }

  if (query.courseId) {
    conditions.push(eq(assignments.courseId, query.courseId));
  }

  const whereClause = combineConditions(conditions);
  const rows = whereClause
    ? await baseQuery.where(whereClause).orderBy(asc(assignments.dueDate), desc(assignments.createdAt))
    : await baseQuery.orderBy(asc(assignments.dueDate), desc(assignments.createdAt));

  res.status(200).json({
    assignments: rows.map(serializeAssignment),
  });
};

const getAssignment = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const { assignmentId } = assignmentIdParamsSchema.parse(req.params);
  const assignmentRecord = await getAssignmentRecord(assignmentId);

  if (!assignmentRecord) {
    throw new HttpError(404, "Assignment not found.");
  }

  await ensureCourseAccess(assignmentRecord.course.id, req.auth);

  res.status(200).json({
    assignment: serializeAssignment(assignmentRecord),
  });
};

const createAssignment = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const payload = createAssignmentSchema.parse(req.body);

  await ensureCourseAccess(payload.courseId, req.auth, { requireManager: true });

  const [createdAssignment] = await db
    .insert(assignments)
    .values({
      courseId: payload.courseId,
      description: payload.description ?? null,
      dueDate: new Date(payload.dueDate),
      maxScore: payload.maxScore ?? null,
      title: payload.title,
    })
    .returning();

  const assignmentRecord = createdAssignment ? await getAssignmentRecord(createdAssignment.id) : null;

  res.status(201).json({
    assignment: assignmentRecord ? serializeAssignment(assignmentRecord) : null,
    message: "Assignment created successfully.",
  });
};

const updateAssignment = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const { assignmentId } = assignmentIdParamsSchema.parse(req.params);
  const payload = updateAssignmentSchema.parse(req.body);
  const assignmentRecord = await getAssignmentRecord(assignmentId);

  if (!assignmentRecord) {
    throw new HttpError(404, "Assignment not found.");
  }

  await ensureCourseAccess(assignmentRecord.course.id, req.auth, { requireManager: true });

  const [updatedAssignment] = await db
    .update(assignments)
    .set({
      description: payload.description,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      maxScore: payload.maxScore,
      title: payload.title,
    })
    .where(eq(assignments.id, assignmentId))
    .returning();

  const nextAssignmentRecord = updatedAssignment ? await getAssignmentRecord(updatedAssignment.id) : null;

  res.status(200).json({
    assignment: nextAssignmentRecord ? serializeAssignment(nextAssignmentRecord) : null,
    message: "Assignment updated successfully.",
  });
};

const listSubmissions = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const { assignmentId } = assignmentIdParamsSchema.parse(req.params);
  const assignmentRecord = await getAssignmentRecord(assignmentId);

  if (!assignmentRecord) {
    throw new HttpError(404, "Assignment not found.");
  }

  await ensureCourseAccess(assignmentRecord.course.id, req.auth, { requireManager: true });

  const submissionRows = await db
    .select({
      student: profiles,
      submission: submissions,
    })
    .from(submissions)
    .innerJoin(profiles, eq(submissions.studentId, profiles.id))
    .where(eq(submissions.assignmentId, assignmentId))
    .orderBy(desc(submissions.submittedAt));

  res.status(200).json({
    submissions: submissionRows.map((row) => ({
      fileUrl: row.submission.fileUrl,
      grade: row.submission.grade,
      gradedAt: row.submission.gradedAt,
      id: row.submission.id,
      student: {
        email: row.student.email,
        fullName: row.student.fullName,
        id: row.student.id,
      },
      studentId: row.submission.studentId,
      submissionText: row.submission.submissionText,
      submittedAt: row.submission.submittedAt,
    })),
  });
};

const submitAssignment = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const { assignmentId } = assignmentIdParamsSchema.parse(req.params);
  const payload = submitAssignmentSchema.parse(req.body);
  const assignmentRecord = await getAssignmentRecord(assignmentId);

  if (!assignmentRecord) {
    throw new HttpError(404, "Assignment not found.");
  }

  if (req.auth.role === "lecturer") {
    throw new HttpError(403, "Lecturers cannot submit student assignments.");
  }

  const studentId = req.auth.role === "admin" ? payload.studentId ?? req.auth.userId : req.auth.userId;

  if (!(await isStudentEnrolled(assignmentRecord.course.id, studentId))) {
    throw new HttpError(403, "The selected student is not enrolled in this course.");
  }

  const nextSubmittedAt = new Date();
  const updateSet: any = {
    submittedAt: nextSubmittedAt,
  };

  if (payload.fileUrl !== undefined) {
    updateSet.fileUrl = payload.fileUrl;
  }

  if (payload.submissionText !== undefined) {
    updateSet.submissionText = payload.submissionText;
  }

  const [submissionRecord] = await db
    .insert(submissions)
    .values({
      assignmentId,
      fileUrl: payload.fileUrl ?? null,
      studentId,
      submissionText: payload.submissionText ?? null,
      submittedAt: nextSubmittedAt,
    })
    .onConflictDoUpdate({
      set: updateSet,
      target: [submissions.assignmentId, submissions.studentId],
    })
    .returning();

  res.status(200).json({
    message: "Assignment submitted successfully.",
    submission: submissionRecord ?? null,
  });
};

const gradeSubmission = async (req: expressTypes.Request, res: expressTypes.Response) => {
  const { assignmentId, submissionId } = gradeSubmissionParamsSchema.parse(req.params);
  const payload = gradeSubmissionSchema.parse(req.body);
  const assignmentRecord = await getAssignmentRecord(assignmentId);

  if (!assignmentRecord) {
    throw new HttpError(404, "Assignment not found.");
  }

  await ensureCourseAccess(assignmentRecord.course.id, req.auth, { requireManager: true });

  const [gradedSubmission] = await db
    .update(submissions)
    .set({
      grade: payload.grade,
      gradedAt: new Date(),
    })
    .where(and(eq(submissions.id, submissionId), eq(submissions.assignmentId, assignmentId)))
    .returning();

  if (!gradedSubmission) {
    throw new HttpError(404, "Submission not found.");
  }

  res.status(200).json({
    message: "Submission graded successfully.",
    submission: gradedSubmission,
  });
};

export = {
  createAssignment,
  getAssignment,
  gradeSubmission,
  listAssignments,
  listSubmissions,
  submitAssignment,
  updateAssignment,
};
