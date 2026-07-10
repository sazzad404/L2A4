import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
  "/categories",
  auth("ADMIN"),
  adminController.getAllCategoryForAdmin,
);

router.post(
  "/create-categories",
  auth("ADMIN"),
  adminController.createCategory,
);

router.get("/bookings", auth("ADMIN"), adminController.getAllBookings);

router.get("/users", auth("ADMIN"), adminController.getAllUser);

router.patch("/users/:id", auth("ADMIN"), adminController.updateUserStatusById);
export const adminRouter = router;
