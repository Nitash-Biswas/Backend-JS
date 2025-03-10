import { useEffect, useState } from "react";
import { BASE_URL, COMMENTS_URL } from "../constants";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchComments = (videoId, refresh) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${COMMENTS_URL}/${videoId}`
        );
        setComments(response.data?.data.allCommentsWithPagination.docs);
        // console.log(response.data?.data.allCommentsWithPagination.docs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId, refresh]);

  return { comments, loading, error };
};

export const useAddComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addComment = async ({ videoId, comment }) => {
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
      const response = await axios.post(
        `${BASE_URL}${COMMENTS_URL}/add/${videoId}`,
        {
          comment,
        },
        { headers, withCredentials: true }
      );

      console.log(response.data.data.createdComment);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading, error };
};

export const useUpdateAndDeleteComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateComment = async ({ commentId, newContent }) => {
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
        `${BASE_URL}${COMMENTS_URL}/update/${commentId}`,
        { newContent: newContent },
        { headers, withCredentials: true }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async ({ commentId }) => {
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
      await axios.delete(
        `${BASE_URL}${COMMENTS_URL}/delete/${commentId}`,
        { headers, withCredentials: true }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateComment, deleteComment, loading, error };
};
