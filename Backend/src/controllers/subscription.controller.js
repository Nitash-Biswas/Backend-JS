import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const getSubscribedChannelsAggregate = async (subscriberId) => {
  const pipeline = [
    {
      $match: {
        subscriber: subscriberId,
      },
    },
    {
      $project: {
        _id: 0,
        channel: 1,
      },
    },
    {
      $group: {
        _id: "channels",
        subscribedChannels: {
          $push: "$channel",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscribedChannels",
        foreignField: "_id",
        as: "subscribedChannels",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullname: 1,
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        subscribedChannels: 1,
      },
    },
  ];

  return Subscription.aggregate(pipeline);
};

const toggleSubscription = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = req.user._id;

  //Check if channel exists
  const channel = await User.findOne({ username: username });
  if (!channel) {
    throw new ApiError(400, "Channel not found");
  }

  //Check if user exists
  const subscriber = await User.findById(user);
  if (!subscriber) {
    throw new ApiError(400, "User not found");
  }

  //Check if user is already subscribed
  const subscription = await Subscription.findOne({
    subscriber: user,
    channel: channel._id,
  });

  //If user is already subscribed, then unsubscribe
  if (subscription) {
    //Delete subscription
    await Subscription.findByIdAndDelete(subscription._id);

    //Subscriber list
    const subsList = await getSubscribedChannelsAggregate(req.user._id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { subscription, subcribedTo: subsList[0]?.subscribedChannels || [] },
          "Unsubscribed"
        )
      );
  }

  //If user is not subscribed, then subscribe
  if (!subscription) {
    const newSubscription = await Subscription.create({
      subscriber: user,
      channel: channel._id,
    });

    //Subscriber list
    const subsList = await getSubscribedChannelsAggregate(user);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { newSubscription, subcribedTo: subsList[0]?.subscribedChannels || [] },
          "Subscribed"
        )
      );
  }
});

const getSubcribedChannels = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const subscribedChannels = await Subscription.aggregate([
    //Step 1: Match the user
    {
      $match: {
        subscriber: user,
      },
    },
    //Step 2:
    {
      $group: {
        _id: "$subscriber",
        subscribedArray: { $push: "$channel" },
      },
    },
    //Step 3: Lookup for subscriber details of the channel
    {
      $lookup: {
        from: "users",
        localField: "subscribedArray",
        foreignField: "_id",
        as: "subscribedList",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullname: 1,
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    //Step 4: Add fields for subscriber count
    { $addFields: { subscribedCount: { $size: "$subscribedList" } } },
    //Step 5: Project to format output
    {
      $project: {
        _id: 1,
        subscribedCount: 1,
        subscribedList: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { subscribedChannels }, "Subscribed channels"));
});

const getUserSubscribers = asyncHandler(async (req, res) => {
  const { username } = req.params;

  //Find channel
  const channel = await User.findOne({ username: username });
  if (!channel) {
    throw new ApiError(400, "Channel not found");
  }



  const subscribers = await Subscription.aggregate([
    //Step 1: Match the channel
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channel._id),
      },
    },
    //Step 2: Create a array of subscribers
    //How $group works:
    // 1. Group by the field specified in _id
    // 2. Create a new field with the name specified in the object
    // 3. Push the value of the field specified in $push to the new field
    // 4. The new field will be an array of all the values of the field specified in $push
    {
      $group: {
        _id: "$channel",
        subscribersArray: { $push: "$subscriber" },
      },
    },

    //Step 3: Lookup for subscriber details of the channel
    {
      $lookup: {
        from: "users",
        localField: "subscribersArray",
        foreignField: "_id",
        as: "subscribersList",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullname: 1,
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    //Step 4: Add fields for subscriber count
    { $addFields: { subscribersCount: { $size: "$subscribersList" } } },
    //Step 5: Project to format output
    {
      $project: {
        _id: 1,
        subscribersCount: 1,
        subscribersList: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { subscribers }, "Subscribed channels"));
});

export { toggleSubscription, getSubcribedChannels, getUserSubscribers };
