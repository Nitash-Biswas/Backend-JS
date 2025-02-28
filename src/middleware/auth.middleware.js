import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  //  as res was not used, we can have "_" as parameter
  try {
    //  get token from cookies or header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorisation")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    //  decoded token is the payload we passed while creating the token,
    //  in our case it was the user id
    const decodedToken = jwt.verify(token, process.env.ACCESS_JWT_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      " -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    //adding user to req object before passing to next middleware
    req.user = user;
    //  passing control to next middleware
    //  it is important to call next() because if we don't call next()
    // the request will be stuck in this middleware
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access");
  }
});
