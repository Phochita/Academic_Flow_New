import expressTypes = require("express");
import zod = require("zod");
import plannerService = require("../services/gemini");
import httpUtils = require("../utils/http");

const { z } = zod;
const { generateStudyPlan } = plannerService;
const { HttpError } = httpUtils;

const generateStudyPlanSchema = z.object({
  assignments: z
    .array(
      z.object({
        dueDate: z.string().trim().optional(),
        estimatedHours: z.number().min(0.5).max(200).optional(),
        title: z.string().trim().min(1).max(200),
      }),
    )
    .max(10)
    .optional(),
  courses: z.array(z.string().trim().min(1).max(120)).max(10).optional(),
  deadline: z.string().trim().max(100).optional(),
  goal: z.string().trim().min(3).max(200),
  preferredSessionMinutes: z.number().int().min(30).max(180).optional(),
  weeklyHours: z.number().int().min(1).max(40).optional(),
});

const createStudyPlan = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const payload = generateStudyPlanSchema.parse(req.body);
  const plan = generateStudyPlan(payload);

  res.status(200).json({
    plan,
    requestedBy: req.auth.userId,
  });
};

export = { createStudyPlan };
