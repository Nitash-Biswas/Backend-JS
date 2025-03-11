import React from "react";
import { NavLink } from "react-router-dom";

function ChannelCard({ fullname, avatar, username }) {
  return (
    <NavLink to={`/user/${username}`}>
      <div className="bg-lightbg shadow-md rounded-lg overflow-hidden flex  w-full p-4">
        <img
          src={avatar || "https://placehold.co/150x150"}
          className="w-16 h-16  object-cover rounded-full"
          alt=""
        />
        <div className="flex flex-col justify-between ml-4.5 mb-2">
          <h2 className="text-xl font-semibold text-lighttext">{fullname}</h2>
          <span className="text-lg text-darktext hover:text-lighttext">{`@${username}`}</span>
        </div>
      </div>
    </NavLink>
  );
}

export default ChannelCard;
