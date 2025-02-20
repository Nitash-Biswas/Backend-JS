# Utilities
## AsyncHandler.js
```js
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
    .catch((err) => next(err));
  };
};

export default asyncHandler;
```
- The **`asyncHandler`** function is a higher-order function that takes a request handler function (requestHandler) as an argument and returns a new function that wraps the original request handler.

- The asyncHandler function returns a new function that takes three arguments: **`req`**, **`res`**, and **`next`**.
- This new function is designed to be used as a middleware function in an Express.js application.
- **`Promise.resolve(requestHandler(req, res, next))`** calls the original requestHandler function with the req, res, and next arguments and wraps the result in a Promise and catch any error in executing requestHandler.