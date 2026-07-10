import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import globalErrorHandler from "./utilities/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.route";
import { technicianRouter } from "./modules/technician/technician.route";
import { servicesRouter } from "./modules/services/services.route";
import { bookingRouter } from "./modules/booking/booking.route";
import { categoryRouter } from "./modules/category/category.route";
import { adminRouter } from "./modules/admin/admin.route";
import { reviewRouter } from "./modules/reviews/reviews.route";
import { subscriptionRouter } from "./modules/subscription/subscruption.route";
import { subscriptionController } from "./modules/subscription/subscription.controller";
import { premiumRouter } from "./modules/premium/premium.route";

const app: Application = express();

// app.post(
//   "/api/subscriptions/webhook",
//   express.raw({ type: "application/json" }),
//   (request, response) => {
//     const endpointSecret = config.stripe_webhook_secret;
//     let event = request.body;
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//       // Get the signature sent by Stripe
//       const signature = request.headers["stripe-signature"]!;
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature ,
//           endpointSecret,
//         );
//       } catch (err: any) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message);
//         return response.sendStatus(400).json({
//           message: err.message,
//         })
//       }
//     }

//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntent = event.data.object;
//         console.log(
//           `PaymentIntent for ${paymentIntent.amount} was successful!`,
//         );
//         // Then define and call a method to handle the successful payment intent.
//         // handlePaymentIntentSucceeded(paymentIntent);
//         break;
//       case "payment_method.attached":
//         const paymentMethod = event.data.object;
//         // Then define and call a method to handle the successful attachment of a PaymentMethod.
//         // handlePaymentMethodAttached(paymentMethod);
//         break;
//       default:
//         // Unexpected event type
//         console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   },
// );

app.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  subscriptionController.handleWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Fix It Now server is running");
});

app.use("/api/auth", authRouter);
app.use("/api/technician", technicianRouter);
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/premium", premiumRouter);

app.use(globalErrorHandler);
export default app;
