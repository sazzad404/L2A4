import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import { bookingService } from "./booking.service";
import sendResponse from "../../utilities/sendResponse";
import HttpStatus from "http-status";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const payload = req.body;

  const result = await bookingService.createBookingIntoDB(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "Booking created successfully",
    data: result,
  });
});

const getBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await bookingService.getBookingsFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Bookings Retrieived successfully",
    data: result,
  });
});

const getBookingsById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
  throw new Error("Unauthorized");
}
  const bookingId = req.params.id;

  const result = await bookingService.getBookingsByidFromDB(
    userId,
    bookingId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Bookings Retrieived successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getBookings,
  getBookingsById
};
