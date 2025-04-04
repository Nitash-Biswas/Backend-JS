import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

//Create Playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and Description are required");
  }
  //create playlist in DB
  const createdPlaylist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!createdPlaylist) {
    throw new ApiError(400, "Error in creating playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { createdPlaylist },
        `Playlist created by ${req.user.username}`
      )
    );
});

//Get playlist by Id
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist Id is required");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "Error in getting playlist");
  }

  const playlistWithVideoDetails = await Playlist.aggregate([
    // Step 1: Match the playlist by ID
    { $match: { _id: new mongoose.Types.ObjectId(playlistId) } },

    // Step 2: Lookup videos and populate owner details within each video
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          // Lookup to get the owner details for each video
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerDetails",
            },
          },
          // Unwind the ownerDetails array (each video has one owner)
          { $unwind: "$ownerDetails" },
          // Project to reshape the video document with owner details
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              description: 1,
              views: 1,
              duration: 1,
              isPublished: 1,
              createdAt: 1,
              updatedAt: 1,
              owner: {
                _id: "$ownerDetails._id",
                fullname: "$ownerDetails.fullname",
                avatar: "$ownerDetails.avatar",
                username: "$ownerDetails.username",
              },
            },
          },
        ],
      },
    },
    // Step 3: Project the necessary fields for the final output
    {
      $project: {
        name: 1,
        description: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        videos: 1,
      },
    },
  ]);

  const finalPlaylist = playlistWithVideoDetails[0] || {
    ...playlist.toObject(),
    videos: [],
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { finalPlaylist }, "Playlist found"));
});


//Delete playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist Id needed");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlistId) {
    throw new ApiError(400, "No playlist found with this id");
  }

  //allow deletion only when the current user is the owner of that playlist
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "You are not authorised to delete this playlist");
  }
  await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist deleted"));
});

//Update playlist
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!playlistId) {
    throw new ApiError(400, "Playlist Id needed");
  }

  if (!(name || description)) {
    throw new ApiError(
      400,
      "Atleast one field, Name or Description is required"
    );
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlistId) {
    throw new ApiError(400, "No playlist found with this id");
  }

  //allow deletion only when the current user is the owner of that playlist
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "You are not authorised to update this playlist");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { name, description },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { updatedPlaylist }, "Playlist updated"));
});

//Get all playlists of a user
const getUserPlaylists = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const allUserPlaylists = await Playlist.aggregate([
    //Step 1: Match the playlists owned by the user
    { $match: { owner: user._id } },
    //Step 2: Lookup to join with User Collection
    {
      $lookup: {
        from: "users", // Collection to join from
        localField: "owner", // Field from the Playlist collection
        foreignField: "_id", // Field from the User collection
        as: "ownerDetails", // Name of the new field for the joined data
      },
    },
    // Stage 2: Unwind to flatten the ownerDetails array into Object
    {
      $unwind: "$ownerDetails",
    },
    //Stage 3: Project to format output
    {
      $project: {
        name: 1,
        description: 1,
        videos: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: {
          _id: "$ownerDetails._id",
          ownerName: "$ownerDetails.fullname",
          avatar: "$ownerDetails.avatar",
          username: "$ownerDetails.username",
        },
      },
    },
  ]);

  if (!allUserPlaylists) {
    throw new ApiError(400, "Error in getting the playlists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { allUserPlaylists },
        "All playlists fetched successfully"
      )
    );
});

//Get all playlists of a user
const getMyPlaylists = asyncHandler(async (req, res) => {

  const allUserPlaylists = await Playlist.aggregate([
    //Step 1: Match the playlists owned by the user
    { $match: { owner: new mongoose.Types.ObjectId(req.user._id) } },
    //Step 2: Lookup to join with User Collection
    {
      $lookup: {
        from: "users", // Collection to join from
        localField: "owner", // Field from the Playlist collection
        foreignField: "_id", // Field from the User collection
        as: "ownerDetails", // Name of the new field for the joined data
      },
    },
    // Stage 2: Unwind to flatten the ownerDetails array into Object
    {
      $unwind: "$ownerDetails",
    },
    //Stage 3: Project to format output
    {
      $project: {
        name: 1,
        description: 1,
        videos: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: {
          _id: "$ownerDetails._id",
          ownerName: "$ownerDetails.fullname",
          avatar: "$ownerDetails.avatar",
        },
      },
    },
  ]);

  if (!allUserPlaylists) {
    throw new ApiError(400, "Error in getting the playlists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { allUserPlaylists },
        "All playlists fetched successfully"
      )
    );
});

//Add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist Id and Video Id are required");
  }

  //Check if playlist and video exist
  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if (!playlist) {
    throw new ApiError(400, "Playlist not found");
  }
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  //Check if playlist is owned by the user
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      400,
      "You are not authorised to add video to this playlist"
    );
  }

  //Check if video is already in the playlist
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in the playlist");
  }

  //Check video is published before adding to playlist
  if (!video.isPublished) {
    throw new ApiError(
      400,
      "Please publish the video before adding to playlist"
    );
  }

  //Add video to playlist
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $push: { videos: videoId } }, //Add video to the videos array
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedPlaylist },
        `Video: (${video.title}) added to playlist: (${playlist.name}) successfully`
      )
    );
});

//Remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId) {
    throw new ApiError(400, "Playlist Id and Video Id are required");
  }

  //Check if playlist and video exist
  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if (!playlist) {
    throw new ApiError(400, "Playlist not found");
  }
  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  //Check if playlist is owned by the user
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      400,
      "You are not authorised to remove video from this playlist"
    );
  }

  //Check if video is not present in the playlist
  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not in the playlist");
  }

  //Remove video from playlist
  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } }, //pull is used to remove an element from an array
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedPlaylist },
        `Video: (${video.title}) removed from Playlist: (${playlist.name}) successfully`
      )
    );
});

//Delete all playlists
const deleteAllPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const playlists = await Playlist.find({ owner: userId });
  if(!playlists){
    throw new ApiError(400, "Playlists not found");
  }

  await Playlist.deleteMany({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, { playlists }, "Playlists deleted successfully."));

})

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  deletePlaylist,
  updatePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getMyPlaylists,
  deleteAllPlaylists
};
