// require('dotenv').config({path: './env'})

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import app from "./app.js";
import connectDB from "./db/index.js";

import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

// import express from "express";
// const app = express();
// const connectDB = async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     console.log("Database connected");
//     app.on("error", (err) => console.log("Error: ", err));
//     app.listen(process.env.PORT,()=> console.log(`Listening on Port ${process.env.PORT}`))
//   } catch (error) {
//     console.log("ERROR: ", error);
//   }
// };

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is Running at ${process.env.PORT}`);
      console.log({"cld_name":process.env.CLOUDINARY_CLOUD_NAME,"at_expiry":process.env.ACCESS_JWT_TOKEN_EXPIRY,"rt_expiry":process.env.REFRESH_JWT_TOKEN_EXPIRY});
    });
    app.on("error", (error) => console.log("APP LISTENING ERROR: ", error));
  })
  .catch((err) => {
    console.log("DB CONNECTION ERROR: ", err);
  });

//async functions like connectDB also acts as Promises, so we can use .then() and .catch()
