import { useEffect, useState } from "react";
import { BASE_URL, COMMENTS_URL } from "../constants";
import axios from "axios";

export const useFetchComments = (videoId) =>{
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
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchComments();
    }, [videoId]);

    return { comments, loading, error };
}