import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const tweetRouter = Router();

// tweetRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file
tweetRouter.route("/get_all_tweets").get(getAllTweets);

tweetRouter.route("/create").post(verifyJWT, createTweet);
tweetRouter.route("/get_user_tweets").get(verifyJWT, getUserTweets);

tweetRouter.route("/update/:tweetId").patch(verifyJWT, updateTweet);
tweetRouter.route("/delete/:tweetId").delete(verifyJWT, deleteTweet);

export default tweetRouter;
