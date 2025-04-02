//Show All Tweets

import React, { useContext } from "react";
import AllTweets from "../../components/Tweets/AllTweets";
import AddComment from "../../components/Comments/AddComment";
import AddTweet from "../../components/Tweets/AddTweet";
import UserContext from "../../contexts/userContext";
import { useFetchAllTweets } from "../../hooks/useTweetHooks";
import Pagination from "../../components/Pagination/Pagination";
// const tweets = [
//   {
//     tweetId: 1,
//     content: "This is a tweet",
//     owner: "John Doe",
//     date: "2021-09-01",
//   },
// ];

function Tweets() {
  const { loggedUser } = useContext(UserContext);
  const { tweets, loading, error, refresh, pagination, fetchTweets } = useFetchAllTweets();

  const handlePageChange = (newPage) => {
    fetchTweets(newPage, pagination.limit);
  };

  return (
    <div className="bg-darkbg h-full text-lighttext flex flex-col p-8">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-4xl font-bold">All Tweets</h1>
      </div>
      {loggedUser && (
        <AddTweet
          username={loggedUser.username}
          avatar={loggedUser.avatar}
          onAddTweet={refresh}
        />
      )}

      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      <AllTweets
        onChange={refresh}
        tweets={tweets}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default Tweets;
