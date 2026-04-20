import express = require("express");
import subscriptionController = require("../controllers/subscriptionController");
import authMiddleware = require("../middleware/auth");

const router = express.Router();
const { activateMySubscription, getSubscriptions, listPlans, refreshSubscriptionStatus } = subscriptionController;
const { requireAuth } = authMiddleware;

router.get("/plans", listPlans);
router.use(requireAuth);
router.get("/", getSubscriptions);
router.post("/", activateMySubscription);
router.post("/refresh", refreshSubscriptionStatus);

export = router;
