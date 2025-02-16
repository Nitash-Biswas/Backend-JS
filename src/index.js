// require('dotenv').config({path: './env'})

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";

import dotenv from "dotenv";

dotenv.config({
  path: "./env",
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

connectDB();
