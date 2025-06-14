import { Router } from "express";
import { reserveHotelRoom } from "../controllers/hotelReservation.controller.js";
import { updateHotelReservation } from "../controllers/hotelReservation.controller.js";
import { updateHotelReservation2 } from "../controllers/hotelReservation.controller.js";

const router = Router()

router.route("/reserveHotelRoom").post(reserveHotelRoom)
router.route("/updateHotelReservation").post(updateHotelReservation)
router.route("/updateHotelReservation2").post(updateHotelReservation2)

export default router;