import express = require("express");
import aiController = require("../controllers/aiController");
import authMiddleware = require("../middleware/auth");
import proMiddleware = require("../middleware/pro");

const router = express.Router();
const { createStudyPlan } = aiController;
const { requireAuth } = authMiddleware;
const { requireStudentPro } = proMiddleware;

router.use(requireAuth);
router.post("/study-plan", requireStudentPro, createStudyPlan);

export = router;
