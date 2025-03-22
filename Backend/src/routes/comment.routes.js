import { Router } from "express";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addComment,
  deleteAllComments,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";

const commentRouter = Router();

// commentRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

commentRouter.route("/:videoId").get(getVideoComments);
commentRouter.route("/add/:videoId").post(verifyJWT, addComment);
commentRouter.route("/update/:commentId").patch(verifyJWT, updateComment);
commentRouter.route("/delete/:commentId").delete(verifyJWT, deleteComment);
commentRouter.route("/delete_all").delete(verifyJWT, deleteAllComments);

export default commentRouter;
