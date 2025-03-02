import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file

// Accessing CRUD operations for a playlist in a single route
playlistRouter
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

playlistRouter.route("/create").post(createPlaylist);

playlistRouter.route("/user/:userId").get(getUserPlaylists);
playlistRouter.route("/add/:videoId/:playlistId").post(addVideoToPlaylist);
playlistRouter.route("/remove/:videoId/:playlistId").post(removeVideoFromPlaylist);

export default playlistRouter;
