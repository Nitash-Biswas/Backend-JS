//  PROMISE METHOD
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
    .catch((err) => next(err));
  };
};

export default asyncHandler;

//  Making a higher order function (function that takes functions as parameters/ return functions)
//  const asyncHandler = (function) => {() => {}} or
//  const asyncHandler = (function) => () => {}

// TRY-CATCH METHOD
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
