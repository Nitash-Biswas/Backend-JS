import React, { createContext, useState } from "react";
import { useFetchAllTweets } from "../hooks/useTweetHooks.js";

const TweetsContext = createContext();

export const TweetsProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
  const { tweets, loading, error } = useFetchAllTweets(refresh);

  const refreshTweets = () => {
    setRefresh((prev) => !prev);
  };

  // useEffect(() => {
  //   console.log("Tweets:", tweets);
  //   console.log("Refresh:", refresh);
  // }, [tweets, refresh]);

  return (
    <TweetsContext.Provider value={{ tweets, loading, error, refreshTweets }}>
      {children}
    </TweetsContext.Provider>
  );
};

export default TweetsContext;
