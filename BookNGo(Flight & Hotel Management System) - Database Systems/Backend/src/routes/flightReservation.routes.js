import { Router } from "express";
import { reserveFlight } from "../controllers/flightReservation.controller.js";
import { updateFlightReservation } from "../controllers/flightReservation.controller.js";
import { updateFlightReservation2 } from "../controllers/flightReservation.controller.js";

const router = Router()

router.route("/reserveFlight").post(reserveFlight)
router.route("/updateFlightReservation").post(updateFlightReservation)
router.route("/updateFlightReservation2").post(updateFlightReservation2)

export default router;