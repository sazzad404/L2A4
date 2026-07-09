import { NextFunction, Request, Response } from "express";
import { Role } from "../../prisma/generated/prisma/enums";
import catchAsync from "../utilities/catchAsync";
import { jwtUtils } from "../utilities/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error(
        "Your are not logged in. Please log in to access this resource.",
      );
    }

    const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret!);

    if (!verifyToken.success) {
      throw new Error(verifyToken.error);
    }

    const { email, name, id, role } = verifyToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error("Forbidden. you dont have access to this resources");
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        role,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    if (user.status === "BANNED") {
      throw new Error("Your account has been blocked, please contact support");
    }

    req.user = {
      email,
      name,
      id,
      role,
    };

    next();
  });
};
