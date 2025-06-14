import { Router } from "express";
import { allAirlines } from "../controllers/airline.controller.js";
import { updateAirlineRating } from "../controllers/airline.controller.js";

const router = Router()

router.route("/allAirlines").get(allAirlines)
router.route("/updateAirlineRating").post(updateAirlineRating)

export default router;