import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, PLAYLISTS_URL } from "../constants";
import Cookies from "js-cookie";
/*
What is a custom hook?
A custom hook is a JavaScript function that allows
you to reuse logic in your React components.
 */
const requestHeaders = () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "x-refresh-token": refreshToken,
  };
  return headers;
};

export const useFetchPlaylist = (playlistId) => {
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${PLAYLISTS_URL}/${playlistId}`
      );
      setPlaylistData(response.data?.data.finalPlaylist);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchPlaylist();
  }, []);
  // console.log(playlistData);
  return { playlistData, error, loading, refresh: fetchPlaylist };
};

// Custom hook to fetch all videos of the logged in user
export const useFetchUserPlaylists = (username) => {
  // State to store tweets, loading and error
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all playlists from the server using axios
  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${PLAYLISTS_URL}/get_user_playlists/${username}`
      );
      setPlaylists(response.data?.data.allUserPlaylists);
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

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return { playlists, loading, error, refresh: fetchPlaylists };
};

export const useManageVideosInPlaylist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headers = requestHeaders();

  const addVideoToPlaylist = async (playlistId, videoId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}${PLAYLISTS_URL}/add/${videoId}/${playlistId}`,
        {},
        { headers, withCredentials: true }
      );
      // console.log(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeVideoFromPlaylist = async (playlistId, videoId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}${PLAYLISTS_URL}/remove/${videoId}/${playlistId}`,
        {},
        { headers, withCredentials: true }
      );
      // console.log(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addVideoToPlaylist, removeVideoFromPlaylist, loading, error };
};

export const useManagePlaylist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headers = requestHeaders();

  const createPlaylist = async ({ name, description }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}${PLAYLISTS_URL}/create`,
        { name: name, description: description },
        { headers, withCredentials: true }
      );
      // console.log(response.data.data.createdPlaylist);
      return response.data.data.createdPlaylist;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePlaylist = async (playlistId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}${PLAYLISTS_URL}/${playlistId}`,
        { headers, withCredentials: true }
      );
      // console.log(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createPlaylist, deletePlaylist, loading, error };
};
