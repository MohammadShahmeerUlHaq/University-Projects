import { Router } from "express";
import { searchValidBundles } from "../controllers/bundle.controller.js";
import { getBundleCost } from "../controllers/bundle.controller.js";
import { updateBundleRating } from "../controllers/bundle.controller.js";

const router = Router()

router.route("/getBundleCost").post(getBundleCost)
router.route("/updateBundleRating").post(updateBundleRating)
router.route("/searchValidBundles").get(searchValidBundles)

export default router;