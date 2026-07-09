import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/create",
  auth("CUSTOMER"),
  bookingController.createBooking,
);

export const bookingRouter = router;
