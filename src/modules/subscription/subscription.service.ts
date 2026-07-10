import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../prisma/generated/prisma/enums";
import {
  handleChangeSubscription,
  handleCheckOutCompleted,
} from "./subscription.utils";

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

    let stripeCustomerId = user.subscriptions?.stripeCustomerId;

    if (!stripeCustomerId) {
      //new user
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/premium?success=false`,
      metadata: {
        userId: user.id,
      },
    });

    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckOutCompleted(event.data.object);
      break;
    case "customer.subscription.updated":
      await handleChangeSubscription(event.data.object);
      break;

    case "customer.subscription.deleted":
      await handleChangeSubscription(event.data.object);
      break;

    default:
      console.log(`No Event Matched. Unhandled event type ${event.type}.`);
      break;
  }
};

const getSubscriptionStatus = async (userId: string) => {
  const isSubscriptionExists = await prisma.subscription.findUnique({
    where: {
      userId,
    },
  });

  const isActive =
    isSubscriptionExists?.status === SubscriptionStatus.ACTIVE &&
    isSubscriptionExists?.currentPeriodEnd &&
    new Date(isSubscriptionExists?.currentPeriodEnd) > new Date();

    return {
      status: isSubscriptionExists?.status,
      isSubscribed : isActive,
      currentPeriodEnd: isSubscriptionExists?.currentPeriodEnd,
    }
};

export const subscriptionService = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus
};
