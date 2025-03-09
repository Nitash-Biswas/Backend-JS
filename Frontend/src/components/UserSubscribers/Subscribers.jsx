import React from "react";
import ChannelCard from "../Card/ChannelCard";

function Subscribers({ subscribers }) {
  return (
    <div className="bg-darkbg p-4">
      {subscribers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {subscribers.map((subscriber) => (
            <ChannelCard
              key={subscriber._id}
              fullname={subscriber.fullname}
              username={subscriber.username}
              avatar={subscriber.avatar}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <h1 className="text-darktext text-2xl">No Subcribers found</h1>
          <p className="text-darktext">There are no subcribers available.</p>
        </div>
      )}
    </div>
  );
}

export default Subscribers;
