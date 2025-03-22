import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  deleteVideoFromCloudinary,
  getPublicId,
  uploadOnCloudinary,
} from "../utils/fileToCloudinary.js";
import jwt from "jsonwebtoken";
import { getMyTweets } from "./tweet.controller.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";

//Options for storing the cookies in the response
const options = {
  httpOnly: true, //cookie is not accessible via client side javascript, prevents XSS attacks
  secure: true, //only modifiable by the server, only sent over HTTPS
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!refreshToken) {
      throw new ApiError(500, "Error in generating refresh token");
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong in generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from user
  const { fullname, email, username, password } = req.body;
  console.log("Email: ", email);

  // validation - not empty
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields is required");
  }

  // check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //either username or email is found
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // console.log(req.files)
  // check for images and avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file required");

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // upload them to cloudinary
  const avatarLink = await uploadOnCloudinary(avatarLocalPath);
  const coverImageLink = await uploadOnCloudinary(coverImageLocalPath);

  // check avatar uploaded
  if (!avatarLink)
    throw new ApiError(400, "Avatar file required from Cloudinary");

  // create user object - create entry in db
  const user = await User.create({
    fullname,
    avatar: avatarLink.url,
    coverImage: coverImageLink?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong registering the User");
  }
  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get username or email, and password from req.body
  const { email, username, password } = req.body;
  //validation
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  //find the user by username or email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  //if user doesn't exist
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  //compare the password
  const isPasswordValid = await user.isPasswordCorrect(password);

  //if wrong password
  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  //generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //send token as cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {},
        `User: ${req.user.fullname} logged out successfully`
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Unauthorised request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_JWT_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    //generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: refreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  //isPasswordCorrect() was defined in the User schema
  if (!isOldPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: req.user, avatarPublicID: getPublicId(req.user.avatar) },
        "Currently Logged In User Fetched"
      )
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  //  get the new avatar image file from the request
  const avatarLocalPath = req.files?.avatar[0]?.path;

  //  if missing
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is missing");
  }
  //  upload to cloudinary
  const avatarLink = await uploadOnCloudinary(avatarLocalPath);

  if (!avatarLink.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  //  update the User with new avatar Image (as new cloudinary Url string)
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatarLink.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  //  delete the old avatar image from cloudinary
  const oldAvatarId = getPublicId(req.user.avatar);
  await deleteFromCloudinary(oldAvatarId);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image File is missing");
  }

  const coverImageLink = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImageLink.url) {
    throw new ApiError(400, "Error while uploading on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImageLink.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  //extracting username from the params of the route url
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    //Stage 1: finding the user with the username
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    //Stage 2:
    //finding all subscribers (with common channel)
    {
      $lookup: {
        from: "subscriptions", // MongoDB collection name (not Model name)
        localField: "_id", // Field from the users collection (Model: User)
        foreignField: "channel", // Channel Field from the subscribers collection (Model: Susbcribers)
        as: "subscribers", // Name of the new field for the joined data
      },
    },
    //Stage 3:
    //finding all channels user is subscribed to (with common subscriber)
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber", // Subscriber Field from the subscribers collection (Model: Susbcribers)
        as: "subscribedTo",
      },
    },
    //Stage 4:
    //adding total channels, subscribers, isSubscribed as new fields to User model
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },

        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    //Stage 5:
    //things to show (1: true)
    {
      $project: {
        fullname: 1,
        username: 1,
        subscriberCount: 1,
        channelsSubscribedToCount: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    //Stage 1:
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id), //as aggregates pass directly to mongoDB, where _id is of datatype ObjectId instead of string.
      },
    },
    //Stage 2:
    {
      $lookup: {
        from: "videos", // Collection to join from
        localField: "watchHistory", // Field from the User collection
        foreignField: "_id", // Field from the Video collection
        as: "watchHistory", // Name of the new field for the joined data
        //sub-pipeline for watchHistory
        pipeline: [
          //Stage 2.1:
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              //sub-pipeline for owner
              pipeline: [
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
          //Stage 2.2:
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch History Fetched Successfully"
      )
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  //Delete all comments of user
  const comments = await Comment.find({ owner: userId });
  if (!comments) {
    throw new ApiError(400, "Error in getting comments");
  }

  await Comment.deleteMany({ owner: userId });

  //Delete all likes of user
  const likes = await Like.find({ likedBy: userId });
  if (!likes) {
    throw new ApiError(400, "Error in getting likes");
  }

  await Like.deleteMany({ likedBy: userId });

  //Delete all playlists of user
  const playlists = await Playlist.find({ owner: userId });
  if (!playlists) {
    throw new ApiError(400, "Playlists not found");
  }

  await Playlist.deleteMany({ owner: userId });

  //Delete all subscriptions of user
  const deletedSubscriptions = await Subscription.find({ subscriber: userId });
  const deletedChannels = await Subscription.find({ channel: userId });
  if (!deletedSubscriptions || !deletedChannels) {
    throw new ApiError(400, "Error in deleting subscriptions");
  }
  await Subscription.deleteMany({ subscriber: userId });
  await Subscription.deleteMany({ channel: userId });

  //Delete all tweets of user
  const tweets = await Tweet.find({ owner: userId });
  if (!tweets) {
    throw new ApiError(400, "Error in getting the tweets");
  }

  await Tweet.deleteMany({ owner: userId });

  //Delete all videos of user
  const videos = await Video.find({ owner: userId });
  if (!videos) {
    throw new ApiError(400, "Error in getting all videos");
  }

  for (const video of videos) {
    const oldVideoId = getPublicId(video.videoFile);
    const oldThumbnailId = getPublicId(video.thumbnail);
    await deleteVideoFromCloudinary(oldVideoId);
    await deleteFromCloudinary(oldThumbnailId);
    await Video.findByIdAndDelete(video._id);
  }

  //Delete user
  const user = await User.findById(userId);
  const oldAvatarId = getPublicId(user.avatar);
  const oldCoverImageId = getPublicId(user.coverImage);
  await deleteFromCloudinary(oldAvatarId);
  await deleteFromCloudinary(oldCoverImageId);
  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {comments, likes, playlists, tweets, videos}, "User deleted successfully."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  deleteUser,
};
