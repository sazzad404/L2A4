import { Router } from "express";
import { serviceController } from "./services.controller";
import { auth } from "../../middlewares/auth";


const router = Router()

router.get("/",serviceController.getAllServices )
router.post("/create-service",auth("TECHNICIAN"), serviceController.createService)


export const servicesRouter = router