import { prisma } from "../../lib/prisma";
import { IBooking } from "./booking.interface";

const createBookingIntoDB = async (userId: string, payload: IBooking) => {
  const { serviceId, bookingDate, slotTime } = payload;

  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
    },
  });

  const result = await prisma.booking.create({
    data: {
      customerId: userId,
      technicianId: service.technicianId,
      serviceId: service.id,
      bookingDate,
      slotTime,
    },
  });

  return result;
};

const getBookingsFromDB = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: {
      customerId: userId,
    },
    include: {
      technician: true,
      service: true,
    },
  });

  return result;
};

const getBookingsByidFromDB = async (userId: string, bookingId: string) => {
  const result = await prisma.booking.findFirstOrThrow({
    where: {
      id: bookingId,
      customerId: userId,
    },
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

export const bookingService = {
  createBookingIntoDB,
  getBookingsFromDB,
  getBookingsByidFromDB
};
