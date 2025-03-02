import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const tweetRouter = Router();

tweetRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

tweetRouter.route("/create").post(createTweet);
tweetRouter.route("/get_tweets").get(getUserTweets);
tweetRouter.route("/update/:tweetId").patch(updateTweet);
tweetRouter.route("/delete/:tweetId").delete(deleteTweet);

export default tweetRouter;
