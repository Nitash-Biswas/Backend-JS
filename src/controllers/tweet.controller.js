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
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    // Stage 2: Unwind to flatten the ownerDetails array into Object
    {
        $unwind: "$ownerDetails",
      },
    //Stage2: Project to format output
    {
      $project: {
        content: 1,
        createdAt: 1,
        owner: {
          _id: "$ownerDetails._id",
          ownerName: "$ownerDetails.fullname",
        },
      },
    },
  ]);

  const x = allTweets[0]
  return res
    .status(200)
    .json(
      new ApiResponse(200, {allTweets, x  }, "All tweets fetched successfully")
    );
});
const updateTweet = asyncHandler(async (req, res) => {});
const deleteTweet = asyncHandler(async (req, res) => {});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
