import { Router } from "express";
import { cancelBundleReservation } from "../controllers/cancelledBundleReservation.controller.js";

const router = Router()

router.route("/cancelBundleReservation").post(cancelBundleReservation)

export default router;