import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

const getTechnicianFromDB = async () => {
  const getProfile = await prisma.technicianProfile.findMany({
    include: {
      user: {
        omit:{
            password: true
        }
      },
    },
  });

  return getProfile;
};

const getTechnicianByid = async (id: string) => {
  try {
    const result = await prisma.technicianProfile.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        user: {
            omit:{
                password: true
            }
        },
      },
    });

    return result
  } catch (error) {
    throw new Error("Not Found");
    
  }
};

export const technicianService = {
  getTechnicianFromDB,
  getTechnicianByid,
};
