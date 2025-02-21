import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/fileToCloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from user
  // validation - not empty
  // check if user already exists
  // check for images and avatar
  // upload them to cloudinary
  // check avatar uploaded
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

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
  const avatarString = await uploadOnCloudinary(avatarLocalPath);
  const coverImageString = await uploadOnCloudinary(coverImageLocalPath);



  // check avatar uploaded
  if (!avatarString)
    throw new ApiError(400, "Avatar file required from Cloudinary");

  // create user object - create entry in db
  const user = await User.create({
    fullname,
    avatar: avatarString.url,
    coverImage: coverImageString?.url || "",
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

export default registerUser;

// MANUAL METHOD WITHOUT ASYNCHANDLER (USING TRY CATCH)
// const registerUser = async (req, res, next) => {
//     try {
//       res.status(200).json({ message: "User registered successfully" });
//     } catch (error) {
//       next(error); // Manually passing errors to Express
//     }
//   };

//When sending request over postman, we use form-data for req.body instead of raw json,
//because we also have to send files (avatar, coverImage) instead of just text data
