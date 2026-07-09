import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ILogin } from "./auth.interface";
import { jwtUtils } from "../../utilities/jwt";
import { SignOptions } from "jsonwebtoken";
import { Role } from "../../../prisma/generated/prisma/enums";

const registerUserIntoDB = async (payload: any) => {
  const { name, email, password, role , location} = payload;

  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isUserExist) {
      throw new Error("User with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bycypt_salt_rounds),
    );

    const result = await prisma.$transaction(async (tx) => {
      const createUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || Role.CUSTOMER,
          
        },
      });

      if (role === Role.TECHNICIAN) {
        await tx.technicianProfile.create({
          data: {
            userId: createUser.id,
            skills: [],
            experience: 1,
            bio: "",
            location
          },
        });
      }

      const finalUserData = await tx.user.findUniqueOrThrow({
        where: {
          id: createUser.id,
        },
        omit: {
          password: true,
        },
        include: {
          technicianProfile: true,
        },
      });

      return finalUserData;
    });

    // const createUser = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //     role,
    //   },
    // });

    // const user = await prisma.user.findUniqueOrThrow({
    //   where: {
    //     id: createUser.id,
    //   },
    //   omit: {
    //     password: true,
    //   },
    //   include: {
    //     technicianProfile: true,
    //   },
    // });

    return result
  } catch (error) {
    throw error;
  }
};

const LoginUserIntoDB = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("Your account has been ban, please contact us!");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Your password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expiration as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiration as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMyProfileFromDB = async (userId: string) => {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
  });

  return userProfile;
};

export const authService = {
  registerUserIntoDB,
  LoginUserIntoDB,
  getMyProfileFromDB,
};
