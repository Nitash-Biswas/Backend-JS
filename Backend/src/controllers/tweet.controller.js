import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
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

const getMyTweets = asyncHandler(async (req, res) => {
  const allTweets = await Tweet.aggregate([
    //Stage1: Match to filter the tweets of the logged in user
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

const getUserTweets = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const allTweets = await Tweet.aggregate([
    //Stage1: Match to filter the tweets of the logged in user
    {
      $match: {
        owner: user._id,
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
        content: 1,
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
    //Stage 5: Sort by createdAt
    {
      $sort:{
        createdAt: -1
      }
    }
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
const getAllTweets = asyncHandler(async (req, res) => {
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
          avatar: "$ownerDetails.avatar",
          username: "$ownerDetails.username",
        },
      },
    },
    //Stage 4: Sort by latest
    {
      $sort: { createdAt: -1 },
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

// Delete Tweet
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

//Delete all tweets of userId
const deleteAllTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const tweets = await Tweet.find({ owner: userId });
  if (!tweets) {
    throw new ApiError(400, "Error in getting the tweets");
  }

  await Tweet.deleteMany({ owner: userId });
  return res
    .status(200)
    .json(
      new ApiResponse(200, { tweets }, "All tweets deleted successfully")
    );
});

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getAllTweets,
  getMyTweets,
  deleteAllTweets
};
