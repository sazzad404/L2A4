import { Status } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICategory } from "./admin.interface";

const createCategoriesIntoDB = async (payload: ICategory) => {
  const { name } = payload;

  const isCategoryExists = await prisma.category.findFirst({
    where: {
      name: {
        equals: payload.name,
        mode: "insensitive",
      },
    },
  });

  if (isCategoryExists) {
    throw new Error("Category already exists");
  }

  const result = await prisma.category.create({
    data: {
      name,
    },
  });

  return result;
};

const getAllBookingsFromDB = async () => {
  const result = await prisma.booking.findMany({
    include: {
      service: true,
      technician: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();

  return result;
};

const updateUserStatusIntoDB = async (userId: string, status: Status) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      status,
    },
    omit: {
      password: true,
    },
  });

  return result;
};

export const adminService = {
  createCategoriesIntoDB,
  getAllBookingsFromDB,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
};
