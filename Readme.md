# Understanding Backend in JS

## Data Model Diagram

- https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj

## Steps for Setting Up and Developing the Backend

### 1. Setup Project

- Initialize a new Node.js project in the backend folder:
  ```bash
  npm init -y
  ```
- Install necessary packages:
  ```bash
  npm install express mongoose dotenv cors cookie-parser
  ```

### 2. Configure Environment Variables

- Create a `.env` file and add necessary environment variables (e.g., `PORT`, `MONGODB_URI`, `CORS_ORIGIN`).

### 3. Setup Express Application

- Create `app.js`:

  ```javascript
  import express from "express";
  import cors from "cors";
  import cookieParser from "cookie-parser";

  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  app.use(express.static("public"));
  app.use(cookieParser());

  // Import and use routes
  import userRouter from "./routes/user.routes.js";
  import tweetRouter from "./routes/tweet.routes.js";
  import videoRouter from "./routes/video.routes.js";
  import commentRouter from "./routes/comment.routes.js";
  import likeRouter from "./routes/like.routes.js";
  import playlistRouter from "./routes/playlist.routes.js";

  app.use("/users", userRouter);
  app.use("/tweets", tweetRouter);
  app.use("/videos", videoRouter);
  app.use("/comments", commentRouter);
  app.use("/likes", likeRouter);
  app.use("/playlists", playlistRouter);

  export default app;
  ```

### 4. Initialize Server

- Create `index.js`:

  ```javascript
  import dotenv from "dotenv";
  import app from "./app.js";
  import connectDB from "./db/index.js";

  dotenv.config({ path: "./.env" });

  connectDB()
    .then(() => {
      app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is Running at ${process.env.PORT}`);
      });
      app.on("error", (error) => console.log("APP LISTENING ERROR: ", error));
    })
    .catch((err) => {
      console.log("DB CONNECTION ERROR: ", err);
    });
  ```

### 5. Database Connection

- Create `db/index.js`:

  ```javascript
  import mongoose from "mongoose";
  import { DB_NAME } from "../constants.js";

  const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(
        `${process.env.MONGODB}/${DB_NAME}`
      );
      console.log(
        `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
      );
    } catch (error) {
      console.log("MONGODB CONNECTION FAILED", error);
      process.exit(1);
    }
  };

  export default connectDB;
  ```

### 6. Define Data Models

- Create models (e.g., `models/user.model.js`, `models/video.model.js`, etc.):

  ```javascript
  import mongoose from "mongoose";

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  export const User = mongoose.model("User", userSchema);
  ```

### 7. Create Routes

- Create route files (e.g., `routes/user.routes.js`, `routes/video.routes.js`, etc.):

  ```javascript
  import express from "express";
  import { getUser, createUser } from "../controllers/user.controller.js";

  const router = express.Router();

  router.get("/:id", getUser);
  router.post("/", createUser);

  export default router;
  ```

### 8. Implement Controllers

- Create controller files (e.g., `controllers/user.controller.js`, `controllers/video.controller.js`, etc.):

  ```javascript
  import { User } from "../models/user.model.js";

  export const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const createUser = async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  ```

### 9. Test API Endpoints

- Use tools like Postman or Insomnia to test your API endpoints.

### 10. Create Utility Functions

- Create a `utils` directory and add utility files as needed (e.g., `utils/validators.js`, `utils/helpers.js`).

  Example: `utils/validators.js`

  ```javascript
  export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  export const validatePassword = (password) => {
    // Add your password validation logic here
    return password.length >= 8;
  };

  export class ApiResponse {
    constructor(statusCode, data, message = "Success") {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
      this.success = statusCode < 400;
    }
  }
  ```

### 12. Create Middleware

- Create a `middleware` directory and add middleware files as needed (e.g., `middleware/auth.js`, `middleware/errorHandler.js`).

  Example: `middleware/auth.js`

  ```javascript
  import jwt from "jsonwebtoken";
  import { User } from "../models/user.model.js";

  export const authenticate = async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorisation")?.replace("Bearer", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error();
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
  ```

  Example: `middleware/errorHandler.js`

  ```javascript
  export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  };
  ```

### 13. Use Middleware in App

- Integrate your custom middleware into the Express application.

  Update `app.js`:

  ```javascript
  import express from "express";
  import cors from "cors";
  import cookieParser from "cookie-parser";
  import { errorHandler } from "./middleware/errorHandler.js";

  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  app.use(express.static("public"));
  app.use(cookieParser());

  // Import and use routes
  import userRouter from "./routes/user.routes.js";
  import tweetRouter from "./routes/tweet.routes.js";
  import videoRouter from "./routes/video.routes.js";
  import commentRouter from "./routes/comment.routes.js";
  import likeRouter from "./routes/like.routes.js";
  import playlistRouter from "./routes/playlist.routes.js";

  app.use("/users", userRouter);
  app.use("/tweets", tweetRouter);
  app.use("/videos", videoRouter);
  app.use("/comments", commentRouter);
  app.use("/likes", likeRouter);
  app.use("/playlists", playlistRouter);

  // Use error handling middleware
  app.use(errorHandler);

  export default app;
  ```

### 14. Add Authentication and Authorization

- Implement authentication and authorization logic using middleware.

  Example: Protecting routes with authentication middleware:

  ```javascript
  import express from "express";
  import { authenticate } from "../middleware/auth.js";
  import { getUser, createUser } from "../controllers/user.controller.js";

  const router = express.Router();

  router.get("/:id", authenticate, getUser);
  router.post("/", createUser);

  export default router;
  ```
