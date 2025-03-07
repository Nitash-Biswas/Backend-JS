import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, VIDEOS_URL } from "../constants";
import Cookies from "js-cookie";
/*
What is a custom hook?
A custom hook is a JavaScript function that allows
you to reuse logic in your React components.
 */

// Custom hook to fetch video data by videoId
export const useFetchVideo = (videoId) => {
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${VIDEOS_URL}/video/${videoId}`
        );
        setVideoData(response.data?.data.video);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchVideo();
  }, [videoId]);

  return { videoData, error };
};

// Custom hook to fetch all videos
export const useFetchAllVideos = () => {
  // State to store videos, loading and error
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all videos from the server using axios
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${VIDEOS_URL}/get_all_videos`
        );
        setVideos(response.data?.data.allVideos);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};

// Custom hook to fetch all videos of the logged in user
export const useFetchUserVideos = () => {
  // State to store videos, loading and error
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all videos from the server using axios
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Get tokens from cookies
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");
        console.log({ accessToken, refreshToken });

        // Set up headers with tokens
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        };

        const response = await axios.get(
          `${BASE_URL}${VIDEOS_URL}/get_user_videos`,
          { headers, withCredentials: true }
        );
        setVideos(response.data?.data.allVideos);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You are not logged in");
        } else {
          setError(err.response?.data?.message || "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
};
