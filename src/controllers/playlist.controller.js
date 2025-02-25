import asyncHandler from "../utils/asyncHandler";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
});
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
});
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
});

export {
  createPlaylist,
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
