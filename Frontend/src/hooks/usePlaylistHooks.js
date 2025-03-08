import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, PLAYLISTS_URL } from "../constants";
import Cookies from "js-cookie";
/*
What is a custom hook?
A custom hook is a JavaScript function that allows
you to reuse logic in your React components.
 */

export const useFetchPlaylist = (playlistId) => {
  const [playlistData, setPlaylistData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${PLAYLISTS_URL}/${playlistId}`
        );
        setPlaylistData(response.data?.data.playlist);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchVideo();
  }, [playlistId]);

  return { playlistData, error };
};

// Custom hook to fetch all videos of the logged in user
export const useFetchUserPlaylists = (username) => {
  // State to store tweets, loading and error
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all playlists from the server using axios
  useEffect(() => {
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

    fetchPlaylists();
  }, []);

  return { playlists, loading, error };
};
