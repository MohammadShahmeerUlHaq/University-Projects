import { Router } from "express";
import { reserveBundle } from "../controllers/bundleReservation.controller.js";

const router = Router()

router.route("/reserveBundle").post(reserveBundle)

export default router;