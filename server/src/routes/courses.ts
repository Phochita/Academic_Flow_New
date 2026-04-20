import express = require("express");
import courseController = require("../controllers/courseController");
import authMiddleware = require("../middleware/auth");
import roleMiddleware = require("../middleware/role");

const router = express.Router();
const { createCourse, createCourseMaterial, enrollStudent, getCourse, listCourseMaterials, listCourses, listCourseStudents, updateCourse } =
  courseController;
const { requireAuth } = authMiddleware;
const { requireRole } = roleMiddleware;

router.use(requireAuth);

router.get("/", listCourses);
router.post("/", requireRole("lecturer", "admin"), createCourse);
router.get("/:courseId/materials", listCourseMaterials);
router.post("/:courseId/materials", requireRole("lecturer", "admin"), createCourseMaterial);
router.get("/:courseId/students", requireRole("lecturer", "admin"), listCourseStudents);
router.post("/:courseId/enrollments", requireRole("lecturer", "admin"), enrollStudent);
router.get("/:courseId", getCourse);
router.patch("/:courseId", requireRole("lecturer", "admin"), updateCourse);

export = router;
