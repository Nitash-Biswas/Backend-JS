import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";



const playlistRouter = Router();

playlistRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

playlistRouter.route("/v/:videoId").post(toggleVideoLike);
playlistRouter.route("/c/:commentId").post(toggleCommentLike);
playlistRouter.route("/t/:tweetId").post(toggleTweetLike);
playlistRouter.route("/liked_videos").post(getLikedVideos);

export default userRouter;
