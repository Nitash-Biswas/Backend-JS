import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";


const userRouter = Router();

userRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

userRouter.route("/:videoId").post(toggleVideoLike);
userRouter.route("/:commentId").post(toggleCommentLike);
userRouter.route("/:tweetId").post(toggleTweetLike);
userRouter.route("/liked_videos").post(getLikedVideos);

export default userRouter;
