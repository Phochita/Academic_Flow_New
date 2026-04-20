import express = require("express");
import authController = require("../controllers/authController");
import authMiddleware = require("../middleware/auth");

const router = express.Router();
const { getMe, login, register, updateMe } = authController;
const { requireAuth } = authMiddleware;

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);

export = router;
