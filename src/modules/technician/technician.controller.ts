import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import { jwtUtils } from "../../utilities/jwt";
import config from "../../config";
import { technicianService } from "./technician.service";
import { Payload } from "@prisma/client/runtime/client";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utilities/sendResponse";
import httpStatus from "http-status";

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

  const {id} = req.params

  if(!id ){
    throw new Error("Technician id required in params");
    
  }
  

  const result = await technicianService.getTechnicianByid(id as string)
   sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician Profile Retrived Successfully",
    data: result,
  });

});

export const technicianController = {
  getTechnician,
  getTechnicianByid,
};
