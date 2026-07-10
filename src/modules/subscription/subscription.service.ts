import Stripe from "stripe";
import config from "../../config";
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
      console.log(event.data.object);

      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer;
      const subscriptionId = session.subscription as string;

      if (!userId || !stripeCustomerId || !subscriptionId) {
        throw new Error("Invalid session");
      }

      const StripeSubscription =
        await stripe.subscriptions.retrieve(subscriptionId);
      console.log("sub info", StripeSubscription);

      const currentPeriodEndMiliSec =
        StripeSubscription.items.data[0]?.current_period_end;

      const cuurentPeriodEnd = new Date(currentPeriodEndMiliSec! * 1000);

      console.log(cuurentPeriodEnd);

      await prisma.subscription.upsert({
        where: {
          userId,
        },
        create: {
          userId,
          stripeCustomerId,
          stripeSubscriptionId: subscriptionId,
          
        },
        update: {},
      });
      break;
    case "customer.subscription.updated":
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;

    case "customer.subscription.deleted":
      break;
    default:
      // Unexpected event type
      console.log(`No Event Matched. Unhandled event type ${event.type}.`);

      break;
  }
};
export const subscriptionService = {
  createCheckoutSession,
  handleWebhook,
};
