# Controllers

## user.controller.js

- ### With `asyncHandler()`

```js
import asyncHandler from "../utils/asyncHandler.js";

//registerUser sends a JSON response with a status code of 200 and a message of "ok".
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
      //No catch error condition.
      //Error will be unhandled rejection
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
