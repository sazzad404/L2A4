import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
  "/checkout",
  auth("ADMIN", "CUSTOMER", "TECHNICIAN"),
  subscriptionController.createCheckoutSession,
);

router.post("/webhook", subscriptionController.handleWebhook);

export const subscriptionRouter = router;
