import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  const alreadyLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  //if already Liked, remove that like
  if (alreadyLiked) {
    await Like.deleteOne(alreadyLiked);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { alreadyLiked },
          `Like removed from video ${videoId}`
        )
      );
  }

  const likeDoc = await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  if (!likeDoc) {
    throw new ApiError(400, "Error in liking video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { likeDoc }, `Like added to video ${videoId}`));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Comment Id is required");
  }

  const alreadyLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  //if already Liked, remove that like
  if (alreadyLiked) {
    await Like.deleteOne(alreadyLiked);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { alreadyLiked },
          `Like removed from comment ${commentId}`
        )
      );
  }

  const likeDoc = await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (!likeDoc) {
    throw new ApiError(400, "Error in liking comment");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { likeDoc }, `Like added to comment ${commentId}`)
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "Tweet Id is required");
  }

  const alreadyLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });
  //if already Liked, remove that like
  if (alreadyLiked) {
    await Like.deleteOne(alreadyLiked);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { alreadyLiked },
          `Like removed from tweet ${tweetId}`
        )
      );
  }

  const likeDoc = await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (!likeDoc) {
    throw new ApiError(400, "Error in liking tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { likeDoc }, `Like added to tweet ${tweetId}`));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //aggregation pipeline

  const allLikedVideos = await Like.aggregate([
    //Step 1: Match the likes on videos liked by the user
    {
      $match: {
        likedBy: req.user._id, //user who liked
        video: { $exists: true }, //videos only
      },
    },
    //Step 2: Lookup to join with the video collection
    {
      $lookup: {
        from: "videos", //collection to join with
        localField: "video", //field in the like collection
        foreignField: "_id", //matched with field in the video collection
        as: "video", //name of the new field to store the matched data
        pipeline: [
          //nested pipeline to project (show) only required fields
          {
            $project: {
              title: 1,
              description: 1,
              videoFile: 1,
              thumbnail: 1,
              views: 1,
              duration: 1,
              owner: 1
            },
          },
        ],
      },
    },
    //Step 3: Expand the details of the user who liked the video
    {
      $lookup: {
        from: "users", //collection to join with
        localField: "likedBy", //field in the like collection
        foreignField: "_id", //matched with field in the video collection
        as: "likedBy", //name of the new field to store the matched data
        pipeline: [
          //nested pipeline to project (show) only required fields
          {
            $project: {
              fullname: 1,
              username: 1,
            },
          },
        ],
      },
    },
    //Step 4: Lookup to join with the users collection to get the owner's fullname
    {
      $lookup: {
        from: "users", //collection to join with
        localField: "video.owner", //field in the video collection
        foreignField: "_id", //matched with field in the users collection
        as: "ownerDetails", //name of the new field to store the matched data
        pipeline: [
          //nested pipeline to project (show) only required fields
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
     //Step 5: Unwind to flatten the video array
     {
      $unwind: "$video",
    },
    //Step 6: Unwind to flatten the likedBy array
    {
      $unwind: "$likedBy",
    },
    //Step 7: Unwind to flatten the ownerDetails array
    {
      $unwind: "$ownerDetails",
    },

  ]);

  if (!allLikedVideos) {
    throw new ApiError(400, "Error in getting liked videos");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { allLikedVideos },
        "Liked videos fetched successfully"
      )
    );
});

const getCommentLikeCount = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Comment Id is required");
  }

  const commentLikeCount = await Like.countDocuments({
    comment: commentId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { commentLikeCount },
        "Comment like count fetched successfully"
      )
    );
});

const getVideoLikeCount = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Comment Id is required");
  }

  const videoLikeCount = await Like.countDocuments({
    video: videoId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videoLikeCount },
        "Video like count fetched successfully"
      )
    );
});

const getTweetLikeCount = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "Comment Id is required");
  }

  const tweetLikeCount = await Like.countDocuments({
    tweet: tweetId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tweetLikeCount },
        "Tweet like count fetched successfully"
      )
    );
});

const checkVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  const isLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: isLiked ? true : false  }, "Video like status fetched"));
})

const checkCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Video Id is required");
  }

  const isLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: isLiked ? true : false }, "Comment like status fetched"));
})

const checkTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "Video Id is required");
  }

  const isLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: isLiked ? true : false  }, "Tweet like status fetched"));
})
export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getCommentLikeCount,
  getVideoLikeCount,
  getTweetLikeCount,
  checkVideoLike,
  checkCommentLike,
  checkTweetLike};
