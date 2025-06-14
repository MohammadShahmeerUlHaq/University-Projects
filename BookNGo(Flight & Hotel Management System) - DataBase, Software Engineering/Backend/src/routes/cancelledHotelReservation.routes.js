import { Router } from "express";
import { cancelHotelReservation } from "../controllers/cancelledHotelReservation.controller.js";

const router = Router()

router.route("/cancelHotelReservation").post(cancelHotelReservation)

export default router;