import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

videoRouter.route("/publish").post(
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
videoRouter.route("/get_videos").get(getAllVideos);
videoRouter.route("/update/:videoId").patch(updateVideo);
videoRouter.route("/delete/:videoId").delete(deleteVideo);
videoRouter.route("/toggle_publish/:videoId").post(togglePublishStatus);

export default videoRouter;
