import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

//  Takes a id of a video as req.params,
//  and returns all comments associated to that video in response
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Error in getting the video");
  }

  // Do not use await here is we need the filter created here to aggregatePaginate()
  const allComments = Comment.aggregate([
    //  Step 1: Filter comments to only those with video as ObjectId(videoId)
    { $match: { video: new mongoose.Types.ObjectId(videoId) } },
    //  Step 2: Perform Left Outer Join with users
    {
      $lookup: {
        from: "users", // Collection to join from
        localField: "owner", // Field from the Tweet collection
        foreignField: "_id", // Field from the User collection
        as: "ownerDetails", // Name of the new field for the joined data
      },
    },
    //  Step 3: Unwind to flatten the ownerDetails array into Object
    {
      $unwind: "$ownerDetails",
    },
    //  Step 4: Project to format output
    {
      $project: {
        _id: 1,
        content: 1,
        createdAt: 1,
        owner: {
          _id: "$ownerDetails._id",
          fullname: "$ownerDetails.fullname",
          username: "$ownerDetails.username",
          avatar: "$ownerDetails.avatar",
        },
        video: 1,
      },
    },
    //  Step 5: Sort by createdAt
    { $sort: { createdAt: -1 } },
  ]);

  if (!allComments) {
    throw new ApiError(400, "Error in getting comments");
  }

  const options = {
    page,
    limit,
  };

  const allCommentsWithPagination = await Comment.aggregatePaginate(
    allComments,
    options
  );

  if (!allCommentsWithPagination) {
    throw new ApiError(400, "Error in getting comments with Pagination");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { allCommentsWithPagination }, "Comments found")
    );
});

//  Takes a id of a video as req.params,
//  Takes the comment text as req.body
//  Create comment
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { comment } = req.body;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }
  if (!comment) {
    throw new ApiError(400, "Comment text is required");
  }

  //Add comment document in DB
  const createdComment = await Comment.create({
    content: comment,
    video: videoId,
    owner: req.user._id,
  });

  if (!createdComment) {
    throw new ApiError(400, "Error in creating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { createdComment }, "Comment created"));
});

//  Takes a id of a comment as req.params,
//  Takes the new comment text as req.body
//  Updates comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { newContent } = req.body;
  const userId = req.user._id;

  if (!commentId) {
    throw new ApiError(400, "Comment Id is required");
  }
  if (!newContent) {
    throw new ApiError(400, "Comment text is required");
  }

  //  Search comment document in DB
  const commentDoc = await Comment.findById(commentId);
  if (!commentDoc) {
    throw new ApiError(400, "Error in getting comment");
  }

  //  Allow update only when the current user is the owner of the comment
  if (commentDoc.owner.toString() === userId.toString()) {
    commentDoc.content = newContent;
    await commentDoc.save({ validateBeforeSave: false });
  } else {
    throw new ApiError(400, "You are not authorised to change this comment");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { commentDoc }, "Comment updated successfully.")
    );
});

//  Takes a id of a comment as req.params
//  Deletes comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId) {
    throw new ApiError(400, "Video Id is required");
  }

  //  Search comment document in DB
  const commentDoc = await Comment.findById(commentId);
  if (!commentDoc) {
    throw new ApiError(400, "Error in getting comment");
  }

  //  Allow delete only when the current user is the owner of the comment
  if (commentDoc.owner.toString() === userId.toString()) {
    // Delete all the likes associated with the comment
    await Like.deleteMany({comment: commentId});
    // Delete the comment
    await Comment.findByIdAndDelete(commentId);
  } else {
    throw new ApiError(400, "You are not authorised to delete this comment");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { commentDoc }, "Comment deleted successfully.")
    );
});

// Delete all comments of userId
const deleteAllComments = asyncHandler(async (req, res) => {
  const userId  = req.user._id;

  const comments = await Comment.find({ owner: userId });
  if (!comments) {
    throw new ApiError(400, "Error in getting comments");
  }

  await Comment.deleteMany({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, { comments }, "Comments deleted successfully."));
})



export { getVideoComments, addComment, updateComment, deleteComment, deleteAllComments };
