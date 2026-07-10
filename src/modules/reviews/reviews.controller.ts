import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import { reviewService } from "./reviews.service";
import sendResponse from "../../utilities/sendResponse";
import httpStatus from "http-status";


const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await reviewService.createReviewsIntoDB(
    userId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};