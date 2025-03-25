import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, TWEETS_URL } from "../constants";
import Cookies from "js-cookie";
/*
What is a custom hook?
A custom hook is a JavaScript function that allows
you to reuse logic in your React components.
 */

// Custom hook to fetch all tweets
export const useFetchAllTweets = () => {
  // State to store videos, loading and error
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tweets from the server using axios
  const fetchTweets = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${TWEETS_URL}/get_all_tweets`
      );
      setTweets(response.data?.data.allTweets);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {


    fetchTweets();
  }, []);

  return { tweets, loading, error, refresh: fetchTweets };
};

// Custom hook to fetch all videos of the logged in user
export const useFetchUserTweets = (username) => {
  // State to store tweets, loading and error
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tweets from the server using axios
  const fetchTweets = async () => {
    try {
      // Get tokens from cookies
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      // Set up headers with tokens
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      };

      const response = await axios.get(
        `${BASE_URL}${TWEETS_URL}/get_user_tweets/${username}`,
        { headers, withCredentials: true }
      );
      setTweets(response.data?.data.allTweets);
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
    fetchTweets();
  }, []);

  return { tweets, loading, error, refresh: fetchTweets };
};

// Custom hook to add a Tweet
export const useAddTweet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTweet = async ({ tweet }) => {
    setLoading(true);
    try {
      //Get Tokens from cookies
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      //Set up headers with tokens
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      };

      //Add comment only when when carrying auth tokens
      await axios.post(
        `${BASE_URL}${TWEETS_URL}/create`,
        {
          content: tweet,
        },
        { headers, withCredentials: true }
      );

      // console.log(response.data.data.createdTweet);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addTweet, loading, error };
};

export const useUpdateAndDeleteTweet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTweet = async ({ tweetId, newContent }) => {
    setLoading(true);
    try {
      // Get Tokens from cookies
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      // Set up headers with tokens
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      };

      // Update comment only when carrying auth tokens
      await axios.patch(
        `${BASE_URL}${TWEETS_URL}/update/${tweetId}`,
        { newContent: newContent },
        { headers, withCredentials: true }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTweet = async ({ tweetId }) => {
    setLoading(true);
    try {
      // Get Tokens from cookies
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      // Set up headers with tokens
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": refreshToken,
      };

      //Delete tweet only when carrying auth tokens
      await axios.delete(`${BASE_URL}${TWEETS_URL}/delete/${tweetId}`, {
        headers,
        withCredentials: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateTweet, deleteTweet, loading, error };
};
