import React from "react";

function TweetCard({ content, owner, date }) {
  return (
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden flex flex-col w-full p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-lighttext">{owner}</h2>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="text-darktext">{content}</p>
    </div>
  );
}

export default TweetCard;
