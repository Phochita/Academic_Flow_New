import express = require("express");
import courseController = require("../controllers/courseController");
import authMiddleware = require("../middleware/auth");
import roleMiddleware = require("../middleware/role");

const router = express.Router();
const {
  confirmCourseInvitation,
  createCourse,
  createCourseMaterial,
  enrollStudent,
  getCourse,
  listCourseMaterials,
  listCourses,
  listCourseStudents,
  listMyCourseInvitations,
  updateCourse,
} =
  courseController;
const { requireAuth } = authMiddleware;
const { requireRole } = roleMiddleware;

router.use(requireAuth);

router.get("/", listCourses);
router.get("/invitations", listMyCourseInvitations);
router.post("/", requireRole("lecturer", "admin"), createCourse);
router.get("/:courseId/materials", listCourseMaterials);
router.post("/:courseId/materials", requireRole("lecturer", "admin"), createCourseMaterial);
router.get("/:courseId/students", requireRole("lecturer", "admin"), listCourseStudents);
router.post("/:courseId/enrollments", requireRole("lecturer", "admin"), enrollStudent);
router.post("/:courseId/enrollments/confirm", requireRole("student"), confirmCourseInvitation);
router.get("/:courseId", getCourse);
router.patch("/:courseId", requireRole("lecturer", "admin"), updateCourse);

export = router;
