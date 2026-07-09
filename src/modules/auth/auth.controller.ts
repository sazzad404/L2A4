import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { authService } from "./auth.service";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utilities/jwt";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await authService.registerUserIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Registered Successfully",
      data: user,
    });
  },
);

const logInUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const { accessToken, refreshToken } =
    await authService.LoginUserIntoDB(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, //1d
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, //7d
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Login Successfully",
    data: { accessToken, refreshToken },
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { accessToken } = req.cookies;

  const verifyToken = jwtUtils.verifyToken(
    accessToken,
    config.jwt_access_secret!,
  );

  if (!verifyToken.success) {
    throw new Error("Invalid token");
  }

  const payload = verifyToken.data as JwtPayload & { id: string };

  const profile = await authService.getMyProfileFromDB(payload.id);

  sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Profile Retrived Successfully",
      data: profile,
    });
});

export const authController = {
  registerUser,
  logInUser,
  getMyProfile,
};
