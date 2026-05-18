import express = require("express");
import profileController = require("../controllers/profileController");
import authMiddleware = require("../middleware/auth");

const router = express.Router();
const { getMyProfile, updateMyProfile, uploadMyAvatar } = profileController;
const { requireAuth } = authMiddleware;

router.get("/me", requireAuth, getMyProfile);
router.post("/me/avatar", requireAuth, uploadMyAvatar);
router.patch("/me", requireAuth, updateMyProfile);

export = router;
