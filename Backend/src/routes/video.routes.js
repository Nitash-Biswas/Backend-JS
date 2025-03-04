import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getUserVideos,
  getVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";

const videoRouter = Router();

// videoRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

videoRouter.route("/publish").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);
videoRouter.route("/video/:videoId").get(getVideoById);
videoRouter.route("/get_all_videos").get(getAllVideos);
videoRouter.route("/get_user_videos").get(verifyJWT, getUserVideos);
videoRouter.route("/update/:videoId").patch(verifyJWT, updateVideo);
videoRouter.route("/delete/:videoId").delete(verifyJWT, deleteVideo);
videoRouter.route("/toggle_publish/:videoId").post(verifyJWT, togglePublishStatus);

export default videoRouter;
