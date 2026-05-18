import express = require("express");
import authController = require("../controllers/authController");
import authMiddleware = require("../middleware/auth");

const router = express.Router();
const { forgotPassword, getMe, login, register, resetPassword, updateMe } = authController;
const { requireAuth } = authMiddleware;

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", requireAuth, resetPassword);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);

export = router;
