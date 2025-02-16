import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//.use() applies middleware to all incoming requests before they reach any route handlers.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//restricts the maximum request body size to 16 kilobytes
// to prevent excessive data from being sent to the server.
// Helps prevent denial-of-service (DoS) attacks caused by large payloads.
app.use(express.json({ limit: "16kb" }));

// urlencoded() is used to parse URL-encoded data
// converts the incoming request body into a JavaScript object (req.body).
// (extended: true) allows for parsing nested objects.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//uses public folder to store static files like images/pdfs
app.use(express.static("public"));

app.use(cookieParser());

export default app;
