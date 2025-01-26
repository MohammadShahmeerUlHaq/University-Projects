import { Router } from "express";
import { searchFlights } from "../controllers/flight.controller.js";

const router = Router()

router.route("/searchFlights").post(searchFlights)

export default router;