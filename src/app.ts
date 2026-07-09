import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import globalErrorHandler from "./utilities/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.route";
import { technicianRouter} from "./modules/technician/technician.route";
import { servicesRouter } from "./modules/services/services.route";
import { bookingRouter } from "./modules/booking/booking.route";
import { categoryRouter } from "./modules/category/category.route";

const app: Application = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: config.app_url,
  credentials: true,
}));



app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api/technician", technicianRouter);
app.use("/api/services", servicesRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/categories", categoryRouter)



app.use(globalErrorHandler)
export default app;