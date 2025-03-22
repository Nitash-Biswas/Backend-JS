import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  checkCommentLike,
  checkTweetLike,
  checkVideoLike,
  deleteAllLikes,
  getCommentLikeCount,
  getLikedVideos,
  getTweetLikeCount,
  getVideoLikeCount,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const likeRouter = Router();

// likeRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

likeRouter.route("/liked_videos").get(verifyJWT, getLikedVideos);
likeRouter.route("/delete_all").delete(verifyJWT, deleteAllLikes);

// Routes for toggling likes for comments, videos, and tweets (require authentication)
likeRouter.route("/v/:videoId").post(verifyJWT, toggleVideoLike);
likeRouter.route("/c/:commentId").post(verifyJWT, toggleCommentLike);
likeRouter.route("/t/:tweetId").post(verifyJWT, toggleTweetLike);

// Routes for checking if the logged-in user has liked a comment, video, or tweet (require authentication)
likeRouter.route("/c/check/:commentId").get(verifyJWT, checkCommentLike);
likeRouter.route("/v/check/:videoId").get(verifyJWT, checkVideoLike);
likeRouter.route("/t/check/:tweetId").get(verifyJWT, checkTweetLike);

// Routes for getting total count of likes for comments, videos, and tweets (do not require authentication)
likeRouter.route("/c/count/:commentId").get(getCommentLikeCount);
likeRouter.route("/v/count/:videoId").get(getVideoLikeCount);
likeRouter.route("/t/count/:tweetId").get(getTweetLikeCount);

export default likeRouter;

/*
ERROR IN USING:

route("/:videoId")
route("/:commentId")

Then both routes will match any parameter
because :videoId and :commentId are dynamic route parameters.
Since Express matches routes sequentially,
the first matching route will be executed.
So, if toggleVideoLike is defined first,
any request to /:commentId (e.g., /123)
will be interpreted as /:videoId and call toggleVideoLike.
*/
