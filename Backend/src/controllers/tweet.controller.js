import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const owner = req.user._id;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet cannot be empty");
  }
  const tweet = await Tweet.create({
    content,
    owner,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const allTweets = await Tweet.aggregate([
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
    //Stage 3: Project to format output
    {
      $project: {
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: {
          _id: "$ownerDetails._id",
          ownerName: "$ownerDetails.fullname",
        },
      },
    },
  ]);

  if (!allTweets) {
    throw new ApiError(400, "Error in getting the tweets");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { allTweets }, "All tweets fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { newContent } = req.body;
  const userId = req.user._id;

  //Find the tweet
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Error in getting the Tweet");
  }

  // console.log({
  //   tweet: typeof tweet.owner, //object (mongoDB ObjectId)
  //   user: typeof userId, //object (mongoDB ObjectId)
  //   isBothEqual: tweet.owner === userId,
  // }); //false, because objects in JS are compared by reference, not value.

  //   allow update only when the current user is the owner of that tweet
  if (tweet.owner.toString() === userId.toString()) {
    tweet.content = newContent;
    await tweet.save({ validateBeforeSave: false });
  } else {
    throw new ApiError(400, "You are not authorised to change this Tweet", []);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet updated successfully."));
});
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const userId = req.user._id;

  //Find the tweet
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Error in getting the Tweet");
  }

  //   allow deletion only when the current user is the owner of that tweet

  if (tweet.owner.toString() === userId.toString()) {
    await Tweet.findByIdAndDelete(tweetId);
  } else {
    throw new ApiError(400, "You are not authorised to delete this Tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet Deleted successfully."));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
