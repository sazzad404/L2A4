import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import httpStatusCode from "http-status";
import { premiumService } from "./permium.service";

const getPremiumConetent = catchAsync(
  async (req: Request, res: Response) => {

    const userId = req.user?.id;

    const result = await premiumService.getPremiumConetent();



    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: "Premium content retrieved successfully",
      data: result,
    }); 
  },
);

export const premiumController = {
  getPremiumConetent,
};
