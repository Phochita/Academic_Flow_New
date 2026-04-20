import express = require("express");
import assignmentController = require("../controllers/assignmentController");
import authMiddleware = require("../middleware/auth");
import roleMiddleware = require("../middleware/role");

const router = express.Router();
const { createAssignment, getAssignment, gradeSubmission, listAssignments, listSubmissions, submitAssignment, updateAssignment } =
  assignmentController;
const { requireAuth } = authMiddleware;
const { requireRole } = roleMiddleware;

router.use(requireAuth);

router.get("/", listAssignments);
router.post("/", requireRole("lecturer", "admin"), createAssignment);
router.get("/:assignmentId/submissions", requireRole("lecturer", "admin"), listSubmissions);
router.post("/:assignmentId/submissions", submitAssignment);
router.patch("/:assignmentId/submissions/:submissionId/grade", requireRole("lecturer", "admin"), gradeSubmission);
router.get("/:assignmentId", getAssignment);
router.patch("/:assignmentId", requireRole("lecturer", "admin"), updateAssignment);

export = router;
