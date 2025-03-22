import { Router } from "express";
import {
    changeCurrentPassword,
  deleteUser,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);

//secure routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh").post(refreshAccessToken);
userRouter.route("/get_user").get(verifyJWT, getCurrentUser);
userRouter.route("/update_avatar").patch(
  verifyJWT,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  updateUserAvatar
);
userRouter.route("/update_cover_image").patch(
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);
userRouter.route("/change_password").post(verifyJWT,changeCurrentPassword)
userRouter.route("/channel/:username").get(getUserChannelProfile)
userRouter.route("/watch_history").get(verifyJWT,getWatchHistory)
userRouter.route("/delete_user").delete(verifyJWT,deleteUser)


export default userRouter;
