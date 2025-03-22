import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createTweet,
  deleteAllTweets,
  deleteTweet,
  getAllTweets,
  getMyTweets,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const tweetRouter = Router();

// tweetRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file
tweetRouter.route("/get_all_tweets").get(getAllTweets);

tweetRouter.route("/create").post(verifyJWT, createTweet);
tweetRouter.route("/get_my_tweets").get(verifyJWT, getMyTweets);
tweetRouter.route("/get_user_tweets/:username").get(getUserTweets);

tweetRouter.route("/update/:tweetId").patch(verifyJWT, updateTweet);
tweetRouter.route("/delete/:tweetId").delete(verifyJWT, deleteTweet);
tweetRouter.route("/delete_all").delete(verifyJWT, deleteAllTweets);


export default tweetRouter;
