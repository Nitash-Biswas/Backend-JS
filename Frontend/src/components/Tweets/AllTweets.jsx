//Show All Tweets

import React, { useContext } from "react";
import TweetCard from "../../components/Card/TweetCard";
import { extractDate } from "../../Utils/extractDate";
import TweetsContext from "../../contexts/tweetContextProvider";
import UserContext from "../../contexts/userContext";

// const tweets = [
//   {
//     tweetId: 1,
//     content: "This is a tweet",
//     owner: "John Doe",
//     date: "2021-09-01",
//   },
// ];

function AllTweets() {
  const { loggedUser } = useContext(UserContext);
  const { tweets, loading, error, refreshTweets } = useContext(TweetsContext);

  if (loading) {
    return (
      <div className="bg-darkbg text-2xl text-lighttext min-h-full p-4">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-darkbg text-2xl min-h-full text-highlight p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-darkbg min-h-full text-lighttext p-4">
      {tweets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweetId={tweet._id}
              content={tweet.content}
              owner={tweet.owner.username}
              date={extractDate(tweet.createdAt)}
              avatar={tweet.owner.avatar}
              loggedUser={loggedUser}
              onTweetUpdated={refreshTweets}
              onTweetDeleted={refreshTweets}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <h1 className="text-darktext text-2xl">No tweets found</h1>
          <p className="text-darktext">There are no tweets available.</p>
        </div>
      )}
    </div>
  );
}

export default AllTweets;
