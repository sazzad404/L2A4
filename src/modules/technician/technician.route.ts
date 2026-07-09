import { Request, Response, Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", technicianController.getTechnician);
router.get("/:id", technicianController.getTechnicianByid);
router.put(
  "/profile",
  auth("TECHNICIAN"),
  technicianController.updateTechnicianProfile,
);
router.put(
  "/availability",
  auth("TECHNICIAN"),
  technicianController.updateTechnicianAvailability,
);

router.get(
  "/bookings",
  auth("TECHNICIAN"),
  technicianController.bookingsTechnician,
);

export const technicianRouter = router;
