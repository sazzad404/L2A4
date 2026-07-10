import { equal } from "node:assert";
import { prisma } from "../../lib/prisma";
import { IQuery } from "./service.interface";
import { SubscriptionStatus } from "../../../prisma/generated/prisma/enums";

const createServiceIntoDB = async (payload: any, userId: string) => {
  const { categoryId, title, price, description, isPremium } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      subscriptions: true,
    },
  });

  if (
    payload.isPremium &&
    user?.subscriptions?.status !== SubscriptionStatus.ACTIVE
  ) {
    throw new Error(
      "You are not subscribed to premium content, so you can not create premium conetent",
    );
  }

  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new Error("Only technicians can create services");
  }

  const isCategoryExists = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!isCategoryExists) {
    throw new Error("category not found. Please provide a valid categoryId");
  }

  const isDublicateService = await prisma.service.findFirst({
    where: {
      technicianId: technicianProfile.id,
      categoryId,
      title: {
        equals: title,
        mode: "insensitive",
      },
    },
  });

  if (isDublicateService) {
    throw new Error("You have already added this service uder this category");
  }

  const result = await prisma.service.create({
    data: {
      title,
      price: parseFloat(price),
      description,
      isPremium,
      categoryId,
      technicianId: technicianProfile.id,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const getallServicesFromDB = async (query: IQuery) => {
  const { type, location, rating } = query;

  const where: any = {
    isPremium: false,
  };

  if (type) {
    where.category = {
      name: {
        equals: type,
        mode: "insensitive",
      },
    };
  }

  if (location) {
    where.technician = {
      ...where.technician,
      location: {
        contains: location,
        mode: "insensitive",
      },
    };
  }

  if (rating) {
    where.technician = {
      ...where.technician,
      rating: {
        gte: Number(rating),
      },
    };
  }

  const result = await prisma.service.findMany({
    where,
    include: {
      category: true,
      technician: {
        include: {
          user: true,
        },
      },
    },
  });

  return result;
};

export const servicesService = {
  getallServicesFromDB,
  createServiceIntoDB,
};
