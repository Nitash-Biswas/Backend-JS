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
import VideoPlayer from "./components/VideoPlayer/VideoPlayer.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import ChannelDashboard from "./components/Dashboard/ChannelDashboard.jsx";
import UserVideos from "./components/UserVideos/UserVideos.jsx";
import UserPlaylists from "./components/UserPlaylists/UserPlaylists.jsx";
import UserTweets from "./components/UserTweets/UserTweets.jsx";
import UserContextProvider from "./contexts/userContextProvider.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="github" element={<Github />} />
      <Route path="history" element={<History />} />
      <Route path="liked_videos" element={<LikedVideos />} />
      <Route path="/user/:username" element={<ChannelDashboard />}>
        <Route path="videos" element={<UserVideos />} />
        <Route path="playlists" element={<UserPlaylists />} />
        <Route path="tweets" element={<UserTweets />} />
      </Route>
      <Route path="stats" element={<Stats />} />
      <Route path="video/:videoId" element={<VideoPlayer />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>
);
