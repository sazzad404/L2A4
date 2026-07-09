import { Request, Response, Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middlewares/auth";


const router = Router()

router.get('/', technicianController.getTechnician )
router.get('/:id', technicianController.getTechnicianByid )
router.put('/profile', auth("TECHNICIAN"), technicianController.updateTechnicianProfile)

export const technicianRouter = router;
