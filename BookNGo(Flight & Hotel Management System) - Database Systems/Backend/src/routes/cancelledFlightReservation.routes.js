import { Router } from "express";
import { cancelFlightReservation } from "../controllers/cancelledFlightReservation.controller.js";

const router = Router()

router.route("/cancelFlightReservation").post(cancelFlightReservation)

export default router;