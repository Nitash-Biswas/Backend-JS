import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  deleteVideoFromCloudinary,
  getPublicId,
  uploadOnCloudinary,
  uploadVideoOnCloudinary,
} from "../utils/fileToCloudinary.js";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // validation - not empty
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields is required");
  }

  //upload in request
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  //check if present in request
  if (!videoLocalPath) {
    throw new ApiError(400, "Video File is missing");
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail File is missing");
  }

  //upload on cloudianry
  const videoLink = await uploadVideoOnCloudinary(videoLocalPath);
  const thumbnailLink = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoLink.url) {
    throw new ApiError(400, "Error while uploading video on cloudinary");
  }
  if (!thumbnailLink.url) {
    throw new ApiError(400, "Error while uploading thumbnail on cloudinary");
  }

  //create video document in database,
  const video = await Video.create({
    videoFile: videoLink.url,
    thumbnail: thumbnailLink.url,
    title,
    description,
    views: 0,
    duration: videoLink.duration,
    isPublished: true,
    owner: req.user._id,
  });

  //searching for newly created video in database
  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new ApiError(400, "Error in creating video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { createdVideo }, "Video created successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Error in getting the video");
  }
  return res.status(200).json(new ApiResponse(200, { video }, "Video found"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const allVideos = await Video.aggregate([
    //Stage1: Lookup to join with User collection
    {
      $lookup: {
        from: "users", // Collection to join from
        localField: "owner", // Field from the Tweet collection
        foreignField: "_id", // Field from the User collection
        as: "ownerDetails", // Name of the new field for the joined data
      },
    },
    // Stage 2: Unwind to flatten the ownerDetails array into Object
    {
      $unwind: "$ownerDetails",
    },
    //Stage2: Project to format output
    {
      $project: {
        title: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        videoFile: 1,
        thumbnail: 1,
        views: 1,
        duration: 1,
        isPublished: 1,
        owner: {
          _id: "$ownerDetails._id",
          ownerName: "$ownerDetails.fullname",
        },
      },
    },
  ]);

  if (!allVideos) {
    throw new ApiError(400, "Error in getting all videos");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { allVideos }, "All videos found"));
});
const getUserVideos = asyncHandler(async (req, res) => {
  const allVideos = await Video.aggregate([
    //Stage1: Match the user
    {
      $match: {
        owner: req.user._id,
      },
    },
    //Stage2: Lookup to join with User collection
    {
      $lookup: {
        from: "users", // Collection to join from
        localField: "owner", // Field from the Tweet collection
        foreignField: "_id", // Field from the User collection
        as: "ownerDetails", // Name of the new field for the joined data
      },
    },
    // Stage 3: Unwind to flatten the ownerDetails array into Object
    {
      $unwind: "$ownerDetails",
    },
    //Stage 4: Project to format output
    {
      $project: {
        title: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        videoFile: 1,
        thumbnail: 1,
        views: 1,
        duration: 1,
        isPublished: 1,
        owner: {
          _id: "$ownerDetails._id",
          ownerName: "$ownerDetails.fullname",
        },
      },
    },
  ]);

  if (!allVideos) {
    throw new ApiError(400, "Error in getting all videos");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { allVideos }, "All videos found"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { newTitle, newDescription } = req.body;

  const userId = req.user._id;

  //Find the video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(
      400,
      "Error in getting the video or video does not exist"
    );
  }

  //   allow update only when the current user is the owner of that video
  let newVideo;
  if (video.owner.toString() === userId.toString()) {
    newVideo = await Video.findByIdAndUpdate(
      videoId,
      { //set new title and description
        $set: {
          title: newTitle,
          description: newDescription,
        },
      },
      { new: true }
    );
  } else {
    throw new ApiError(400, "You are not authorised to update this video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { newVideo }, "Video updated successfully."));
});
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const userId = req.user._id;

  //Find the video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(
      400,
      "Error in getting the video or video doesn't exist"
    );
  }

  //   allow deletion only when the current user is the owner of that video
  if (video.owner.toString() === userId.toString()) {
    await Video.findByIdAndDelete(videoId);
  } else {
    throw new ApiError(400, "You are not authorised to delete this video");
  }

  //  delete the old video and thumbnail image from cloudinary
  const oldVideoId = getPublicId(video.videoFile);
  const oldThumbnailId = getPublicId(video.thumbnail);
  await deleteVideoFromCloudinary(oldVideoId);
  await deleteFromCloudinary(oldThumbnailId);

  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video deleted successfully."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Error in getting the video");
  }

  if(video.owner.toString() !== req.user._id.toString()){
    throw new ApiError(400, "You are not authorised to change the status of this video");
  }

  //toggle the publish status
  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Status updated successfully."));
});

export {
  publishVideo,
  getVideoById,
  getAllVideos,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getUserVideos
};
