import { useCallback, useEffect, useState } from "react";
import { BASE_URL, COMMENTS_URL } from "../constants";
import axios from "axios";
import Cookies from "js-cookie";

export const useFetchComments = (videoId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalComments: 0,
  });

  const fetchComments = useCallback(async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${COMMENTS_URL}/${videoId}`,
        {
          params: {
            page: page,
            limit: limit,
          },
        }
      );

      const { docs, totalPages, totalDocs } =
        response.data?.data.allCommentsWithPagination;
      setComments(docs);
      setPagination({
        page: page,
        limit: limit,
        totalPages: totalPages,
        totalComments: totalDocs,
      });
      // console.log(response.data?.data.allCommentsWithPagination);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  },[videoId]);

  useEffect(() => {
    fetchComments();
  }, []);

  const refresh = useCallback(() => {
    fetchComments(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit]);

  return {
    comments,
    loading,
    error,
    pagination,
    fetchComments,
    refresh
  };
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

      // console.log(response.data.data.createdComment);
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

      // Delete comment only when carrying auth tokens
      await axios.delete(`${BASE_URL}${COMMENTS_URL}/delete/${commentId}`, {
        headers,
        withCredentials: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateComment, deleteComment, loading, error };
};
