import React, { createContext, useEffect, useState } from "react";
import { useFetchComments } from "../hooks/useCommentHook.js";

const CommentsContext = createContext();

export const CommentsContextProvider = ({ children, videoId }) => {
  const [refresh, setRefresh] = useState(false);
  const { comments, loading, error } = useFetchComments(videoId, refresh);



  const refreshComments = () => {
    setRefresh((prev) => !prev);
  };

  // useEffect(() => {
  //   console.log("Video ID:", videoId);
  // console.log("Comments:", comments);
  // console.log("Refresh:", refresh);
  // }, [videoId, comments, refresh]);



  return (
    <CommentsContext.Provider value={{ comments, loading, error, refreshComments }}>
      {children}
    </CommentsContext.Provider>
  );
};

export default CommentsContext;