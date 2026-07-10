import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import httpStatus from "http-status"
import { servicesService } from "./services.service";
import sendResponse from "../../utilities/sendResponse";

const createService = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const userId = req.user?.id;
  

 

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await servicesService.createServiceIntoDB(
    payload,
    userId as string,
  );

    sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {

  const result = await servicesService.getallServicesFromDB(req.query)

 sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service Retrived successfully",
    data: result,
  });
});

export const serviceController = {
  getAllServices,
  createService,
};
