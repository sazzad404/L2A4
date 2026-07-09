import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/create", auth("CUSTOMER"), bookingController.createBooking);
router.get("/", auth("CUSTOMER"), bookingController.getBookings);
router.get("/:id", auth("CUSTOMER"), bookingController.getBookingsById);
export const bookingRouter = router;
