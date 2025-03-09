import React from "react";

function TweetCard({ content, owner, date, avatar }) {
  return (
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden flex flex-col w-full p-4">
      <div className="flex justify-start">
        <img
          src={avatar || "https://placehold.co/150x150"}
          className="w-16 h-16  object-cover rounded-full"
          alt=""
        />
        <div className="flex  flex-col justify-center ml-4 w-full">
          <div className="flex   justify-between items-center  ">
            <h2 className="text-lg font-semibold text-lighttext">{content}</h2>
            <span className="text-sm text-gray-500">{date}</span>
          </div>

          <p className="text-darktext">{owner}</p>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;
