import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
//////////////////////////////////////////////////////   MIDDLEWARE    ///////////////////////////////////////////////////////

//  .use() applies middleware to all incoming requests before they reach any route handlers.
app.use(
  cors({
    origin:  'http://localhost:5173' || process.env.CORS_ORIGIN , // Allow requests from this origin
    credentials: true,          //  allows cookies to be sent and received by the server
  })
);


//  restricts the maximum request body size to 16 kilobytes
// to prevent excessive data from being sent to the server.
// Helps prevent denial-of-service (DoS) attacks caused by large payloads.
app.use(express.json({ limit: "16kb" }));

//   urlencoded() is used to parse URL-encoded data
// converts the incoming request body into a JavaScript object (req.body).
// (extended: true) allows for parsing nested objects.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//  uses public folder to store static files like images/pdfs
app.use(express.static("public"));

app.use(cookieParser());

//////////////////////////////////////////////////////   ROUTES    /////////////////////////////////////////////////////////
//  routes import
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subsRouter from "./routes/subscriber.routes.js";

//  routes declaration

//  as the routes and controller are in different files we use them as middleware app.use()
//  also gives ability to use any http method instead of one like app.get()
app.use("/users", userRouter);
app.use("/tweets", tweetRouter);
app.use("/videos", videoRouter);
app.use("/comments", commentRouter);
app.use("/likes", likeRouter);
app.use("/playlists", playlistRouter)
app.use("/subscriptions", subsRouter)


export default app;
