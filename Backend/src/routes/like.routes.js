import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const likeRouter = Router();

likeRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

likeRouter.route("/v/:videoId").post(toggleVideoLike);
likeRouter.route("/c/:commentId").post(toggleCommentLike);
likeRouter.route("/t/:tweetId").post(toggleTweetLike);
likeRouter.route("/liked_videos").get(getLikedVideos);

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
