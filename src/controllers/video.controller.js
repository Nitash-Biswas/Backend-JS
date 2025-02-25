import { Video } from "../models/video.model";
import { ApiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/fileToCloudinary";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // validation - not empty
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields is required");
  }

  //upload in request
  const videoLocalPath = req.files?.video[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  //check if present in request
  if (!videoLocalPath) {
    throw new ApiError(400, "Video File is missing");
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail File is missing");
  }

  //upload on cloudianry
  const videoLink = await uploadOnCloudinary(videoLocalPath);
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
  });
});
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
