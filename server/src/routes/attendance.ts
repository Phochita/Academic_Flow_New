import express = require("express");
import attendanceController = require("../controllers/attendanceController");
import authMiddleware = require("../middleware/auth");
import roleMiddleware = require("../middleware/role");

const router = express.Router();
const { getAttendanceSummary, listAttendance, markAttendance } = attendanceController;
const { requireAuth } = authMiddleware;
const { requireRole } = roleMiddleware;

router.use(requireAuth);

router.get("/summary", getAttendanceSummary);
router.get("/", listAttendance);
router.post("/", requireRole("lecturer", "admin"), markAttendance);

export = router;
