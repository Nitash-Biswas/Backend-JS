import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";

const userRouter = Router();

userRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

userRouter.route("/:videoId").get(getVideoComments);
userRouter.route("/add_comment").post(addComment);
userRouter.route("/update_comment").patch(updateComment);
userRouter.route("/delete_comment").post(deleteComment);

export default userRouter;
