import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getMyPlaylists,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const playlistRouter = Router();

// playlistRouter.use(verifyJWT); //Apply vefiryJWT middleware to all routes in this file


playlistRouter.route("/create").post(verifyJWT, createPlaylist);
playlistRouter.route("/get_my_playlists").get(verifyJWT, getMyPlaylists);
playlistRouter.route("/get_user_playlists/:username").get(getUserPlaylists);
playlistRouter.route("/add/:videoId/:playlistId").post(verifyJWT, addVideoToPlaylist);
playlistRouter.route("/remove/:videoId/:playlistId").post(verifyJWT, removeVideoFromPlaylist);

// Accessing CRUD operations for a playlist in a single route
playlistRouter
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(verifyJWT, updatePlaylist)
  .delete(verifyJWT, deletePlaylist);

export default playlistRouter;
