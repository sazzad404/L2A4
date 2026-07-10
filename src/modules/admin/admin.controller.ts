import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import { categoryService } from "../category/category.service";
import sendResponse from "../../utilities/sendResponse";
import httpSuccess from "http-status";
import { adminService } from "./admin.service";

const getAllCategoryForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategoryFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpSuccess.OK,
      message: "Categories Retrived SuccessFully",
      data: result,
    });
  },
);

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await adminService.createCategoriesIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpSuccess.CREATED,
    message: "Categories Created SuccessFully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllBookingsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpSuccess.OK,
    message: "Bookings Retrived SuccessFully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpSuccess.OK,
    message: "Users Retrived SuccessFully",
    data: result,
  });
});

const updateUserStatusById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const { status } = req.body;

  const result = await adminService.updateUserStatusIntoDB(
    userId as string,
    status,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpSuccess.OK,
    message: "User status updated successfully",
    data: result,
  });
});

export const adminController = {
  getAllCategoryForAdmin,
  createCategory,
  getAllBookings,
  getAllUser,
  updateUserStatusById
};
