import { prisma } from "../../lib/prisma";

const createReviewsIntoDB = async (userId: string, payload: any) => {
  const { bookingId, rating, comment } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
  });

  if (booking.customerId !== userId) {
    throw new Error("Forbidden! This booking does not belong to you.");
  }

  if (booking.status !== "COMPLETED") {
    throw new Error("You can review only after the job is completed.");
  }

  const isReviewExists = await prisma.review.findFirst({
    where: {
      bookingId,
    },
  });

  if (isReviewExists) {
    throw new Error("You have already reviewed this booking.");
  }

  const result = await prisma.review.create({
    data: {
      bookingId,
      customerId: userId,
      technicianId: booking.technicianId,
      rating,
      comment,
    },
    include: {
      booking: true,
      customer: {
        omit: {
          password: true,
        },
      },
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

  const avgRating = await prisma.review.aggregate({
    where: {
      technicianId: booking.technicianId,
    },
    _avg: {
      rating: true,
    },
  });

  await prisma.technicianProfile.update({
    where: {
      id: booking.technicianId,
    },
    data: {
      rating: avgRating._avg.rating ?? 0,
    },
  });

  return result;
};

export const reviewService ={
    createReviewsIntoDB
}