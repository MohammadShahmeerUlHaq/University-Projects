import { Router } from "express";
import { loginAdmin } from "../controllers/admin.controller.js";
import { updateHotelReservationStatuses } from "../controllers/admin.controller.js";
import { updateFlightReservationStatuses } from "../controllers/admin.controller.js";
import { updateBundleReservationStatuses } from "../controllers/admin.controller.js";
import { getAllHotels } from "../controllers/admin.controller.js";
import { getAllFlights } from "../controllers/admin.controller.js";
import { getAllAirlines } from "../controllers/admin.controller.js";
import { addHotel } from "../controllers/admin.controller.js";
import { addFlight } from "../controllers/admin.controller.js";
import { addAirline } from "../controllers/admin.controller.js";
import { updateHotel } from "../controllers/admin.controller.js";
import { updateFlight } from "../controllers/admin.controller.js";

const router = Router()

router.route("/login").post(loginAdmin)
router.route("/updateHotelReservationStatuses").get(updateHotelReservationStatuses)
router.route("/updateFlightReservationStatuses").get(updateFlightReservationStatuses)
router.route("/updateBundleReservationStatuses").get(updateBundleReservationStatuses)
router.route("/getAllHotels").get(getAllHotels)
router.route("/getAllFlights").get(getAllFlights)
router.route("/getAllAirlines").get(getAllAirlines)
router.route("/addHotel").post(addHotel)
router.route("/addFlight").post(addFlight)
router.route("/addAirline").post(addAirline)
router.route("/updateHotel").post(updateHotel)
router.route("/updateFlight").post(updateFlight)

export default router;