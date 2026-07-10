import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../prisma/generated/prisma/enums";

export const getPeriodEnd = (payload: Stripe.Subscription) => {
  const currentPeriodEndMiliSec = payload.items.data[0]?.current_period_end;

  const currentPeriodEnd = new Date(currentPeriodEndMiliSec! * 1000);

  return currentPeriodEnd;
};

export const handleCheckOutCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !subscriptionId) {
    console.log("Webhook: Missing values for creating checkout sessions");
    return;
  }

  const StripeSubscription =
    await stripe.subscriptions.retrieve(subscriptionId);

  const currentPeriodEnd = getPeriodEnd(StripeSubscription);

  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId: subscriptionId,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId: subscriptionId,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd,
    },
  });
};

export const handleChangeSubscription = async (payload: Stripe.Subscription) => {
  const stripeSubscriptionId = payload.id;

  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCELLED
        : SubscriptionStatus.EXPIRED;

  const currentPeriodEnd = getPeriodEnd(payload);

  const isSubscriptionExist = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId,
    },
  });

  if (!isSubscriptionExist) {
    console.log("Webhook: no subscription found");
  }

  await prisma.subscription.update({
    where: {
      stripeSubscriptionId,
    },
    data: {
      status,
      currentPeriodEnd,
    },
  });
};
