//Show All Tweets

import React, { useContext } from "react";
import TweetCard from "../../components/Card/TweetCard";
import AllTweets from "../../components/Tweets/AllTweets";
import AddComment from "../../components/Comments/AddComment";
import AddTweet from "../../components/Tweets/AddTweet";
import UserContext from "../../contexts/userContext";
import { TweetsProvider } from "../../contexts/tweetContextProvider";
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
  return (
    <TweetsProvider>
    <div className="bg-darkbg min-h-full text-lighttext p-4">
      <div className="flex justify-between items-center pb-8 pt-4 px-4">
        <h1 className="text-4xl font-bold">All Tweets</h1>
      </div>
      {loggedUser && <AddTweet username={loggedUser.username} avatar={loggedUser.avatar}/>}

      <AllTweets/>
    </div>
    </TweetsProvider>
  );
}

export default Tweets;
