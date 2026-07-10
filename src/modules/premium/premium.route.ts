import { NextFunction, Request, Response, Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middlewares/auth";
import catchAsync from "../../utilities/catchAsync";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.get(
  "/",
  auth("ADMIN", "CUSTOMER", "TECHNICIAN"),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const subscripton = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscripton) {
      throw new Error("You are not subscribed to premium content");
    }
    if (subscripton?.status !== SubscriptionStatus.ACTIVE) {
      throw new Error("You are not subscribed to premium content");
    }

    next();
  }),
  premiumController.getPremiumConetent,
);

export const premiumRouter = router;
