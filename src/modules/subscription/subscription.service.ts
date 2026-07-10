import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscriptions: true,
      },
    });

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });

    
  });
};

export const subscriptionService = {
  createCheckoutSession,
};
