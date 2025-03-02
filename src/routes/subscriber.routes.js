import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getSubcribedChannels,
  getUserSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const subsRouter = Router();

subsRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

subsRouter.route("/:channelId").post(toggleSubscription);
subsRouter.route("/get_channels").get(getSubcribedChannels);
subsRouter.route("/get_subs/:channelId").get(getUserSubscribers);

export default subsRouter;
