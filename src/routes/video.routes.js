import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteVideo,
  getVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";

const userRouter = Router();

userRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

userRouter.route("/publish").post(
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);
userRouter.route("/:videoId").get(getVideoById);
userRouter.route("/update").patch(updateVideo);
userRouter.route("/delete").post(deleteVideo);
userRouter.route("/liked_videos").post(togglePublishStatus);

export default userRouter;
