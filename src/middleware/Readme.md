# Middleware

# Multer - File Upload Middleware for Node.js

## **What is Multer?**

- **Multer** is a middleware for handling `multipart/form-data`, which is used for uploading files in **Node.js** applications.
- It simplifies the process of accepting and processing file uploads, including managing storage, file validation, and error handling.

## **Why is Multer Used?**

1. **Handling `multipart/form-data`:** Multer helps parse complex form data that includes files and regular form fields, which is not easy to do manually.
2. **File Uploads:** It allows seamless handling of file uploads from clients, such as image, video, or document files.
3. **Storage Management:** Multer provides an easy way to store uploaded files either in memory or on disk.

## **1. Code Example: Disk Storage Configuration**

###  multer.middleware.js

```js
import multer from "multer";

// Disk storage configuration (ideal for large files like videos and PDFs)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Specify the folder where files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Specify the file name
  },
});

// Create multer upload middleware with the storage configuration
const upload = multer({
  storage, // Use the storage configuration
});

export { upload }; // Export upload middleware for use in routes
```

## **2. Using as middleware in routes**

### user.routes.js

```js
userRouter.route("/update_avatar").patch(
  //middleware 1: verify logged in user with Jwt tokens in cookies
  verifyJWT,

  //middleware 2: multer upload middleware
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  //req.files is an object where
  //req.files

  //controller at the end
  updateUserAvatar
);

userRouter.route("/update_cover_image").patch(
  verifyJWT,
  upload.single("coverImage"), //upload.single to upload single file
  updateUserCoverImage
);
```

## **3. Accessing the Uploaded files**

### user.controller.js

```js
const avatarLocalPath = req.files?.avatar[0]?.path; // File path of the avatar file
```

# Authentication using JWT (Json Web Token)

## **1. Generating tokens `AccessToken` and `RefreshToken`**

### user.model.js

```js
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    //payload object
    {
      _id: this._id,    //using the _id of the user who calls it.
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    //access Token
    process.env.ACCESS_JWT_TOKEN_SECRET,
    //expiry object
    {
      expiresIn: process.env.ACCESS_JWT_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    //payload object
    {
      _id: this._id,
    },
    //access Token
    process.env.REFRESH_JWT_TOKEN_SECRET,
    //expiry object
    {
      expiresIn: process.env.REFRESH_JWT_TOKEN_EXPIRY,
    }
  );
};
```
### user.controller.js

```js
const user = await User.findById(userId);
const accessToken = user.generateAccessToken();
```

## **2. Middleware to Authenticate requests**

### auth.middleware.js

```js
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  //as res was not used, we can have "_" as parameter
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorisation")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    //extract the payload by decoding
    // {
    //   _id: this._id,
    //   email: this.email,
    //   username: this.username,
    //   fullname: this.fullname,
    // },
    const decodedToken = jwt.verify(token, process.env.ACCESS_JWT_TOKEN_SECRET);

    //using _id to find the current user in database
    const user = await User.findById(decodedToken?._id).select(
      " -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user; //returned request user is now the current logged in user
    next(); //Move to next middleware in stack
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access");
  }
});
```

## **3. Using `VerifyJWT` middleware in routes**

### user.routes.js

```js
userRouter.route("/change_password").post(
  //verifyJWT: auth middleware
  verifyJWT,

  //controller function
  changeCurrentPassword
);
```
