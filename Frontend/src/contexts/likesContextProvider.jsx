import React, { createContext, useEffect, useState } from "react";
import { useFetchLikedVideos } from "../hooks/useLikeHook";

const LikesContext = createContext();

export const LikesContextProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
  const { likedVideos, loading, error } = useFetchLikedVideos(refresh);

  const refreshContext = () => {
    setRefresh((prev) => !prev);
  };

  return(
    <LikesContext.Provider value={{ likedVideos, loading, error, refreshContext }}>
      {children}
    </LikesContext.Provider>
  )
};

export default LikesContext;
