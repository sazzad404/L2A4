import { Request, Response, Router } from "express";
import { technicianController } from "./technician.controller";


const router = Router()

router.get('/', technicianController.getTechnician )
router.get('/:id', technicianController.getTechnicianByid )

export const technicianRouter = router;