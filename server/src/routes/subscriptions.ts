import express = require("express");
import subscriptionController = require("../controllers/subscriptionController");
import authMiddleware = require("../middleware/auth");
import roleMiddleware = require("../middleware/role");

const router = express.Router();
const {
  activateMySubscription,
  approvePendingSubscription,
  confirmMyPayment,
  createMyAbaPaySandboxSession,
  getAdminSubscriptionRequests,
  getSubscriptions,
  listPlans,
  refreshSubscriptionStatus,
} = subscriptionController;
const { requireAuth } = authMiddleware;
const { requireRole } = roleMiddleware;

const paymentRouteInfo = (_req: express.Request, res: express.Response) => {
  res.status(200).json({
    message: "ABA Pay sandbox payment endpoint is available.",
    paymentFlow: {
      confirmPayment: "POST /api/subscriptions/payment-confirmations",
      createSession: "POST /api/subscriptions/aba-pay-sandbox-sessions",
      note: "Open the subscription page and choose a plan to create a sandbox payment session.",
    },
  });
};

router.get("/plans", listPlans);
router.get("/aba-pay-sandbox-sessions", paymentRouteInfo);
router.get("/aba-pay-sandbox-session", paymentRouteInfo);
router.get("/aba-pay-send-box-sessions", paymentRouteInfo);
router.get("/card-checkout-sessions", paymentRouteInfo);
router.get("/payment-confirmations", paymentRouteInfo);
router.get("/payment-confirmation", paymentRouteInfo);
router.use(requireAuth);
router.get("/", getSubscriptions);
router.get("/admin", requireRole("admin"), getAdminSubscriptionRequests);
router.patch("/admin/:subscriptionId/approve", requireRole("admin"), approvePendingSubscription);
router.post("/", activateMySubscription);
router.post("/aba-pay-sandbox-sessions", createMyAbaPaySandboxSession);
router.post("/aba-pay-sandbox-session", createMyAbaPaySandboxSession);
router.post("/aba-pay-send-box-sessions", createMyAbaPaySandboxSession);
router.post("/card-checkout-sessions", createMyAbaPaySandboxSession);
router.post("/payment-confirmations", confirmMyPayment);
router.post("/payment-confirmation", confirmMyPayment);
router.post("/refresh", refreshSubscriptionStatus);

export = router;
