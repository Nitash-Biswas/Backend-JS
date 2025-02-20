import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async(req,res)=>{
    res.status(200).json({
        message: "User registered successfully"
    })
})

export default registerUser

// MANUAL METHOD WITHOUT ASYNCHANDLER (USING TRY CATCH)
// const registerUser = async (req, res, next) => {
//     try {
//       res.status(200).json({ message: "User registered successfully" });
//     } catch (error) {
//       next(error); // Manually passing errors to Express
//     }
//   };