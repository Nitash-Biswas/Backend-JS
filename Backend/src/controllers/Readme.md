# Controllers

`Controllers are functions` which execute when a user goes to a particular route ( or requests ).

```js
//  routes/user.routes.js
userRouter.route("/login").post(loginUser);
```

Controller `loginUser` will execute when user sends a post request to `localhost:8000/users/login`.

# Concepts to learn:

- CRUD operations in Mongoose.
- Taking data from **`req.params`**, **`req.body`** or **`req.cookies`**.
- Aggregation pipelines for joining multiple collections, nesting pipelines, use of operators **`$lookup`**, **`$project`** or **`$addFields`**.
- Functions and properties like: **`.select("-password")`** , **`validateBeforeSave: false`**

# user.controller.js

- ### With `asyncHandler()`

```js
import asyncHandler from "../utils/asyncHandler.js";

//  registerUser sends a JSON response with a status code of 200 and a message of "ok".
const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

export default registerUser;
```

- ### Without `asyncHandler()`, using `try/catch.`

```js
const registerUser = async (req, res, next) => {
  try {
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    next(error); // Manually passing errors to Express
  }
};
```

- ### Advantages of `asyncHandler():`
  Higher order function: A function which:
  - takes a function `requestHandler`
  - and returns a function `(req, res, next) => {
Promise.resolve(requestHandler)};`

```js
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
```

- ## **ErrorHandling**:

  **`.catch((err)) => next(err)`** always ensures that any error thrown by requestHandler is propagated properly without crashing the server.

- ## Example of crashing:

  - If in asyncHandler():

  ```js
  const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next));
      //  No catch error condition.
      //  Error will be unhandled rejection
    };
  };
  ```

  - And registerUser:

  ```js
  const registerUser = asyncHandler(async (req, res) => {
    throw new Error("Can't Register");
  });
  ```

  - #### On visiting `localhost:8000/users/register`, the server will crash because of `Unhandled Promise Rejection`

- ## **Code Reusability**:
  Instead of duplicating error handling code in every asynchronous function, you can simply wrap each function with asyncHandler.

# Controllers in user.controller.js

## Helper Function: `generateAccessAndRefreshTokens()`

Create and return a new pair of access and refresh Tokens for a given user ( userId ).

```js
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //update the refresh token of the user in the database
    user.refreshToken = refreshToken;

    //save the changes made in the database
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong in generating tokens");
  }
};
```

### What `validateBeforeSave: false` do?

`Disable Mongoose schema validation` for that specific `save()` operation.

Reasons:

- No critical user data is being changed (like email or password).
- Performance boost by avoiding unnecessary validations.
- Prevents issues if unrelated required fields (like email or username) haven't been set during this specific operation.

## 1. registerUser()

```js
const registerUser = asyncHandler(async (req, res) => {
  //  get user details from user
  const { fullname, email, username, password } = req.body;
  console.log("Email: ", email);

  //  validation - not empty
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields is required");
  }

  //  check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //either username or email is found
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //  check for images and avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file required");

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  //  upload them to cloudinary
  const avatarString = await uploadOnCloudinary(avatarLocalPath);
  const coverImageString = await uploadOnCloudinary(coverImageLocalPath);

  //  check avatar uploaded
  if (!avatarString)
    throw new ApiError(400, "Avatar file required from Cloudinary");

  //  create user object - create entry in db
  const user = await User.create({
    fullname,
    avatar: avatarString.url,
    coverImage: coverImageString?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  //  remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //  check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong registering the User");
  }
  //  return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
```

## 2. loginUser()

```js
const loginUser = asyncHandler(async (req, res) => {
  //  get username or email, and password from req.body
  const { email, username, password } = req.body;

  //  if none of username or email is present
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  //  find the user by username or email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  //  if user doesn't exist
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  //  compare the password
  const isPasswordValid = await user.isPasswordCorrect(password);
  //isPasswordCorrect() was defined in User Model

  //  if wrong password
  if (!isPasswordValid) {
    throw new ApiError(401, "Password is incorrect");
  }

  //  generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //  .select() allows to return the asked user (as object),
  //  but without fields mentioned (-password, -refreshToken)

  //  send token as cookies

  //  .cookie(name,token,options) stores the cookies in the response

  const options = {
    httpOnly: true,
    secure: true, //only modifiable by the server
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      //  ApiResponse(status, data, message)
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
```

## 3. logoutUser()

```js
const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    { new: true } //returns new updated user
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
```

## 4. refreshAccessToken()

When the Access Token expires (because of its short expiry period), instead of asking the User to login again,
we can match his Refresh Token (stays for longer) in his Cookies to the Refresh Token present in the database for authentication.

```js
const refreshAccessToken = asyncHandler(async (req, res) => {
  //  RefreshToken could be present in the cookies(web) or body(mobile).
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  //  If Refresh Token is not present
  if (!incomingRefreshToken) {
    throw new ApiError(400, "Unauthorised request");
  }

  //  try/catch because jwt.verify() could fail.
  try {
    //  If Refresh Token is correct, it should give the same payload {_id} of our User (defined in user.model.js)
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.ACCESS_JWT_TOKEN_SECRET
    );

    //  Use the id to find the User
    const user = await User.findById(decodedToken?._id);

    //  If no user exists
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    //  If User's refresh token doesn't match with his token in the database,
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    //  Generate new Tokens for future
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return (
      res
        .status(200)
        //  Update the tokens in the cookies also
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              accessToken,
              refreshToken: newRefreshToken,
            },
            "Access token refreshed successfully"
          )
        )
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh token");
  }
});
```

## 4. changeCurrentPassword()

```js
const { oldPassword } = req.body;
const user = await User.findById(req.user?._id);

const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword); //true
//isPasswordCorrect() was defined in the User schema
```
