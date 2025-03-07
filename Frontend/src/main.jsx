import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import Github from "./components/Github/Github.jsx";
import Home from "./components/Home/Home.jsx";
import History from "./components/History/History.jsx";
import LikedVideos from "./components/LikedVideos/Liked_Videos.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Stats from "./components/Stats/Stats.jsx";
import { extractDate } from "./Utils/extractDate.js";
import { formatDuration } from "./Utils/formatDuration.js";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";

console.log(extractDate("2025-03-02T15:17:06.652Z"));
console.log(formatDuration(4.086712));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="github" element={<Github />} />
      <Route path="history" element={<History />} />
      <Route path="liked_videos" element={<LikedVideos />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="stats" element={<Stats />} />
      <Route path="video/:videoId" element={<VideoPlayer />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
