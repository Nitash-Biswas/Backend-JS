import React from "react";

function CommentCard({ content, owner, date, avatar }) {
  return (
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden flex flex-col w-full p-4">
      <div className="flex justify-center items-center">
        <img
          src={avatar || "https://placehold.co/150x150"}
          className="w-10 h-10  object-cover rounded-full"
          alt=""
        />
        <div className="flex  flex-col justify-center ml-4 w-full">
          <div className="flex   justify-between items-center  ">
            <p className="text-darktext text-sm">{`@${owner}`}</p>
            <span className="text-xs text-darktext">{date}</span>
          </div>
          <h2 className="text-lg font-semibold text-lighttext">{content}</h2>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
