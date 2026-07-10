import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import { subscriptionService } from "./subscription.service";

import httpStatusCode from "http-status";
import sendResponse from "../../utilities/sendResponse";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await subscriptionService.createCheckoutSession(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);
export const subscriptionController = {
  createCheckoutSession,
};
