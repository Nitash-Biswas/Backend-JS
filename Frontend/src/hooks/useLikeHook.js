import { useCallback, useEffect, useState } from "react";
import { BASE_URL, LIKES_URL } from "../constants";
import axios from "axios";
import Cookies from "js-cookie";

const requestHeaders = () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "x-refresh-token": refreshToken,
  };
  return headers;
};

//Custom hook to fetch liked videos
export const useFetchLikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLikedVideos = async () => {
    try {
      const headers = requestHeaders();

      //Show Liked Videos only when when carrying auth tokens
      const response = await axios.get(
        `${BASE_URL}${LIKES_URL}/liked_videos`,
        { headers, withCredentials: true }
      );
      setLikedVideos(response.data?.data.allLikedVideos);
      // console.log(response.data?.data.allCommentsWithPagination.docs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchLikedVideos();
  }, []);

  return { likedVideos, loading, error, refresh: fetchLikedVideos };
};

//Custom hook to like a video, comment or tweet
export const useToggleLike = () => {
  const [loadingLike, setLoadingLike] = useState(false);
  const [errorLike, setErrorLike] = useState(null);

  //Toggle video like
  const toggleVideoLike = async ({ videoId }) => {
    setLoadingLike(true);
    try {
      const headers = requestHeaders();

      const response = await axios.post(
        `${BASE_URL}${LIKES_URL}/v/${videoId}`,
        {},
        { headers, withCredentials: true }
      );

      // console.log(response.data.data);
      return response.data.data;
    } catch (err) {
      setErrorLike(err.message);
    } finally {
      setLoadingLike(false);
    }
  };

  //Toggle comment like
  const toggleCommentLike = async ({ commentId }) => {
    setLoadingLike(true);
    try {
      const headers = requestHeaders();

      const response = await axios.post(
        `${BASE_URL}${LIKES_URL}/c/${commentId}`,
        {},
        { headers, withCredentials: true }
      );

      // console.log(response.data.data);
      return response.data.data;
    } catch (err) {
      setErrorLike(err.message);
    } finally {
      setLoadingLike(false);
    }
  };

  //Toggle tweet like
  const toggleTweetLike = async ({ tweetId }) => {
    setLoadingLike(true);
    try {
      const headers = requestHeaders();

      const response = await axios.post(
        `${BASE_URL}${LIKES_URL}/t/${tweetId}`,
        {},
        { headers, withCredentials: true }
      );

      // console.log(response.data.data);
      return response.data.data;
    } catch (err) {
      setErrorLike(err.message);
    } finally {
      setLoadingLike(false);
    }
  };

  return {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    loadingLike,
    errorLike,
  };
};

//Custom hook to get total likes for a video, comment or tweet
export const useGetTotalLikes = () => {
  const [loadingLike, setLoadingLike] = useState(false);
  const [errorLike, setErrorLike] = useState(null);

  //Get total likes for a video
  const getVideoLikes = useCallback(async ({ videoId }) => {
    setLoadingLike(true);
    try {
      const headers = requestHeaders();

      const response = await axios.get(
        `${BASE_URL}${LIKES_URL}/v/count/${videoId}`,

        { headers, withCredentials: true }
      );

      // console.log(response.data.data.videoLikeCount);
      return response.data.data.videoLikeCount;
    } catch (err) {
      setErrorLike(err.message);
    } finally {
      setLoadingLike(false);
    }
  }, []);

  //Get total likes for a comment
  const getCommentLikes = useCallback(async ({ commentId }) => {
    setLoadingLike(true);
    try {
      const headers = requestHeaders();

      const response = await axios.get(
        `${BASE_URL}${LIKES_URL}/c/count/${commentId}`,

        { headers, withCredentials: true }
      );

      // console.log(response.data.data.commentLikeCount);
      return response.data.data.commentLikeCount;
    } catch (err) {
      setErrorLike(err.message);
    } finally {
      setLoadingLike(false);
    }
  }, []);

  //Get total likes for a tweet
  const getTweetLikes = useCallback(async ({ tweetId }) => {
    setLoadingLike(true);
    try {
      const headers = requestHeaders();

      const response = await axios.get(
        `${BASE_URL}${LIKES_URL}/t/count/${tweetId}`,

        { headers, withCredentials: true }
      );

      // console.log(response.data.data.tweetLikeCount);
      return response.data.data.tweetLikeCount;
    } catch (err) {
      setErrorLike(err.message);
    } finally {
      setLoadingLike(false);
    }
  }, []);

  return {
    getVideoLikes,
    getCommentLikes,
    getTweetLikes,
    loadingLike,
    errorLike,
  };
};

//Custom hook to check if a user has liked a video, comment or tweet
export const useCheckLike = () => {
  const [loadingLikeCheck, setLoadingLikeCheck] = useState(false);
  const [errorLikeCheck, setErrorLikeCheck] = useState(null);

  //Check if a user has liked a video
  const checkVideoLike = useCallback(async ({ videoId }) => {
    setLoadingLikeCheck(true);
    try {
      const headers = requestHeaders();

      const response = await axios.get(
        `${BASE_URL}${LIKES_URL}/v/check/${videoId}`,

        { headers, withCredentials: true }
      );

      // console.log(response.data.data.isLiked);
      return response.data.data.isLiked;
    } catch (err) {
      setErrorLikeCheck(err.message);
    } finally {
      setLoadingLikeCheck(false);
    }
  }, []);

  //Check if a user has liked a comment
  const checkCommentLike = useCallback(async ({ commentId }) => {
    setLoadingLikeCheck(true);
    try {
      const headers = requestHeaders();

      const response = await axios.get(
        `${BASE_URL}${LIKES_URL}/c/check/${commentId}`,

        { headers, withCredentials: true }
      );

      // console.log(response.data.data.isLiked);
      return response.data.data.isLiked;
    } catch (err) {
      setErrorLikeCheck(err.message);
    } finally {
      setLoadingLikeCheck(false);
    }
  }, []);

  //Check if a user has liked a tweet
  const checkTweetLike = useCallback(async ({ tweetId }) => {
    setLoadingLikeCheck(true);
    try {
      const headers = requestHeaders();

      const response = await axios.get(
        `${BASE_URL}${LIKES_URL}/t/check/${tweetId}`,

        { headers, withCredentials: true }
      );

      // console.log(response.data.data.isLiked);
      return response.data.data.isLiked;
    } catch (err) {
      setErrorLikeCheck(err.message);
    } finally {
      setLoadingLikeCheck(false);
    }
  }, []);

  return {
    checkVideoLike,
    checkCommentLike,
    checkTweetLike,
    loadingLikeCheck,
    errorLikeCheck,
  };
};
