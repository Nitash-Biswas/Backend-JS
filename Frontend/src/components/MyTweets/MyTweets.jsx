import React from "react";
import TweetCard from "../Card/TweetCard";


const tweets = [
  {
    tweetId: 1,
    content: "This is a tweet",
    owner: "John Doe",
    date: "2021-09-01",
  },
  {
    tweetId: 2,
    content: "This is another tweet",
    owner: "Jane Doe",
    date: "2021-09-02",
  },
  {
    tweetId: 3,
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos porro, expedita, quae reiciendis a, eius quod perferendis possimus voluptatum et repudiandae aliquid reprehenderit magnam qui aliquam architecto facilis nulla aperiam nostrum quidem? Laboriosam optio aut exercitationem tenetur, praesentium cum facere non voluptas cupiditate ad quibusdam, fugit commodi voluptatum dolores omnis!",
    owner: "John Doe",
    date: "2021-09-03",
  },
  {
    tweetId: 4,
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos porro, expedita, quae reiciendis a, eius quod perferendis possimus voluptatum et repudiandae aliquid reprehenderit magnam qui aliquam architecto facilis nulla aperiam nostrum quidem? Laboriosam optio aut exercitationem tenetur, praesentium cum facere non voluptas cupiditate ad quibusdam, fugit commodi voluptatum dolores omnis!",
    owner: "John Doe",
    date: "2021-09-03",
  },
  {
    tweetId: 5,
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos porro, expedita, quae reiciendis a, eius quod perferendis possimus voluptatum et repudiandae aliquid reprehenderit magnam qui aliquam architecto facilis nulla aperiam nostrum quidem? Laboriosam optio aut exercitationem tenetur, praesentium cum facere non voluptas cupiditate ad quibusdam, fugit commodi voluptatum dolores omnis!",
    owner: "John Doe",
    date: "2021-09-03",
  },
  {
    tweetId: 6,
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos porro, expedita, quae reiciendis a, eius quod perferendis possimus voluptatum et repudiandae aliquid reprehenderit magnam qui aliquam architecto facilis nulla aperiam nostrum quidem? Laboriosam optio aut exercitationem tenetur, praesentium cum facere non voluptas cupiditate ad quibusdam, fugit commodi voluptatum dolores omnis!",
    owner: "John Doe",
    date: "2021-09-03",
  },
  {
    tweetId: 7,
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos porro, expedita, quae reiciendis a, eius quod perferendis possimus voluptatum et repudiandae aliquid reprehenderit magnam qui aliquam architecto facilis nulla aperiam nostrum quidem? Laboriosam optio aut exercitationem tenetur, praesentium cum facere non voluptas cupiditate ad quibusdam, fugit commodi voluptatum dolores omnis!",
    owner: "John Doe",
    date: "2021-09-03",
  },

];

function MyTweets() {
  return (
    <div className="bg-darkbg p-4">
      {tweets.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet.tweetId}
              content={tweet.content}
              owner={tweet.owner}
              date={tweet.date}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <h1 className="text-darktext text-2xl">No videos found</h1>
          <p className="text-darktext">There are no videos available.</p>
        </div>
      )}
    </div>
  );
}

export default MyTweets;
