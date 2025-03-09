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
import Github from "./pages/Github/Github.jsx";
import Home from "./pages/Home/Home.jsx";
import History from "./pages/History/History.jsx";
import LikedVideos from "./pages/LikedVideos/Liked_Videos.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Stats from "./pages/Stats/Stats.jsx";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import ChannelDashboard from "./components/Dashboard/ChannelDashboard.jsx";
import UserVideos from "./components/UserVideos/UserVideos.jsx";
import UserPlaylists from "./components/UserPlaylists/UserPlaylists.jsx";
import UserTweets from "./components/UserTweets/UserTweets.jsx";
import UserContextProvider from "./contexts/userContextProvider.jsx";
import PrivateRoute from "./contexts/privateRoute.jsx";
import NotLoggedIn from "./pages/NotLoggedIn/NotLoggedIn.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="github" element={<Github />} />
      <Route path="history" element={<History />} />
      <Route path="liked_videos" element={<LikedVideos />} />
      <Route
        path="/user/:username"
        element={
          <PrivateRoute>
            <ChannelDashboard />
          </PrivateRoute>
        }
      >
        <Route path="videos" element={<UserVideos />} />
        <Route path="playlists" element={<UserPlaylists />} />
        <Route path="tweets" element={<UserTweets />} />
      </Route>
      <Route path="stats" element={<Stats />} />
      <Route path="video/:videoId" element={<VideoPlayer />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
      <Route path="no-auth" element={<NotLoggedIn />} />
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
