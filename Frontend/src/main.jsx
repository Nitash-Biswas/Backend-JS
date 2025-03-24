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
import Home from "./pages/Home/Home.jsx";
import History from "./pages/History/History.jsx";
import LikedVideos from "./pages/LikedVideos/Liked_Videos.jsx";
import Stats from "./pages/Stats/Stats.jsx";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import ChannelDashboard from "./pages/Dashboard/ChannelDashboard.jsx";
import UserVideos from "./components/UserVideos/UserVideos.jsx";
import UserPlaylists from "./components/UserPlaylists/UserPlaylists.jsx";
import UserTweets from "./components/UserTweets/UserTweets.jsx";
import UserContextProvider from "./contexts/userContextProvider.jsx";
import PrivateRoute from "./contexts/privateRoute.jsx";
import NotLoggedIn from "./pages/NotLoggedIn/NotLoggedIn.jsx";
import Playlist from "./components/Playlist/Playlist.jsx";
import Tweets from "./pages/Tweets/Tweets.jsx";
import { LikesContextProvider } from "./contexts/likesContextProvider.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import { TweetsProvider } from "./contexts/tweetContextProvider.jsx";
import CreateVideo from "./pages/CreateVideo/CreateVideo.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />

      <Route
        path="history"
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        }
      />
      <Route
        path="liked_videos"
        element={
          <PrivateRoute>
            <LikesContextProvider>
              <LikedVideos />
            </LikesContextProvider>
          </PrivateRoute>
        }
      />

      <Route path="/user/:username" element={<ChannelDashboard />}>
        <Route path="videos" element={<UserVideos />} />
        <Route path="playlists" element={<UserPlaylists />} />
        <Route
          path="tweets"
          element={
            <TweetsProvider>
              <UserTweets />
            </TweetsProvider>
          }
        />
      </Route>
      <Route
        path="stats"
        element={
          <PrivateRoute>
            <Stats />
          </PrivateRoute>
        }
      ></Route>

      <Route
        path="create"
        element={
          <PrivateRoute>
            <CreateVideo />
          </PrivateRoute>
        }
      />
      <Route path="video/:videoId" element={<VideoPlayer />} />
      <Route path="playlist/:playlistId" element={<Playlist />} />

      <Route path="profile" element={<Profile />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="tweets" element={<Tweets />} />
      <Route path="*" element={<NotFound />} />
      <Route path="no-auth" element={<NotLoggedIn />} />
      <Route path="no-auth-dashboard" element={<NotLoggedIn />} />
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
