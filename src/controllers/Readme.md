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

- **`ErrorHandling`**: \
   By wrapping the **`registerUser`** function with asyncHandler, any errors that occur within registerUser will be caught and handled by asyncHandler.
- **`Code Reusability`**: \
   Instead of duplicating error handling code in every asynchronous function, you can simply wrap each function with asyncHandler.
