import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ITechnician } from "./technician.interface";

const getTechnicianFromDB = async () => {
  const getProfile = await prisma.technicianProfile.findMany({
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  return getProfile;
};

const getTechnicianByidFromDB = async (id: string) => {
  try {
    const result = await prisma.technicianProfile.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    throw new Error("Not Found");
  }
};

const updateTechnicianProfileIntoDB = async (
  userId: string,
  payload: ITechnician,
) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where:{
      userId
    }
  });

  

  const result = await prisma.technicianProfile.update({
    where:{
      id: technician.id
    },
    data: payload,
    include:{
      user:{
        omit:{
          password: true
        }
      }
    }
  })


  return result;
};

export const technicianService = {
  getTechnicianFromDB,
  getTechnicianByidFromDB,
  updateTechnicianProfileIntoDB,
};
