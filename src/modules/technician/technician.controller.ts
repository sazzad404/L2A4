import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import { jwtUtils } from "../../utilities/jwt";
import config from "../../config";
import { technicianService } from "./technician.service";
import { Payload } from "@prisma/client/runtime/client";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utilities/sendResponse";
import httpStatus from "http-status";
import { ITechnician } from "./technician.interface";

const getTechnician = catchAsync(async (req: Request, res: Response) => {
  const technicianProfile = await technicianService.getTechnicianFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technicians Profile Retrived Successfully",
    data: technicianProfile,
  });
});

const getTechnicianByid = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("Technician id required in params");
  }

  const result = await technicianService.getTechnicianByidFromDB(id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician Profile Retrived Successfully",
    data: result,
  });
});

const updateTechnicianProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const Payload = req.body;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const result = await technicianService.updateTechnicianProfileIntoDB(
      userId,
      Payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician Profile Update Successfully",
      data: result,
    });
  },
);

const updateTechnicianAvailability = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Unauthorized!");
    }

    const result = await technicianService.updateTechnicianAvailabilityIntoDB(
      userId,
      req.body.availability,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician availablity Profile Update Successfully",
      data: result,
    });
  },
);

const bookingsTechnician = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("Unauthorized!");
  }

  const result = await technicianService.getBookingsFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician Bookings Retrived Successfully",
    data: result,
  });
});

export const technicianController = {
  getTechnician,
  getTechnicianByid,
  updateTechnicianProfile,
  updateTechnicianAvailability,
  bookingsTechnician,
};
