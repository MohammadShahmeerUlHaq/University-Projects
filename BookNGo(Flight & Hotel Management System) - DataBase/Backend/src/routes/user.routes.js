import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { authenticateUser } from "../controllers/user.controller.js";
import { getUserHotelReservationHistory } from "../controllers/user.controller.js";
import { getUserFlightReservationHistory } from "../controllers/user.controller.js";
import { getUserBundleReservationHistory } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/authenticate").post(authenticateUser)
router.route("/getUserHotelReservationHistory").post(getUserHotelReservationHistory)
router.route("/getUserFlightReservationHistory").post(getUserFlightReservationHistory)
router.route("/getUserBundleReservationHistory").post(getUserBundleReservationHistory)

export default router;