import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getSubcribedChannels,
  getUserSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const subsRouter = Router();

// subsRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

subsRouter.route("/:username").post(verifyJWT, toggleSubscription);
subsRouter.route("/get_channels").get(verifyJWT, getSubcribedChannels);
subsRouter.route("/get_subs/:username").get(getUserSubscribers);

export default subsRouter;
