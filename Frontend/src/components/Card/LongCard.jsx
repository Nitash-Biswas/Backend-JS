import React from "react";
import { NavLink } from "react-router-dom";

export default function LongCard({
  title = "No title",
  thumbnail = "No thumbnail",
  uploader = "Someone",
  videoId = "No videoId",
  description = "No description",
  username = "N/A",
}) {
  return (
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden flex flex-col lg:flex-row">
      <NavLink to={`/video/${videoId}`} className="flex-shrink-0">
        <img src={thumbnail} alt={title} className=" h-fit w-full lg:w-96 object-cover" />
      </NavLink>
      <div className="p-4 flex flex-col justify-between ">
        <div>
          <NavLink to={`/video/${videoId}`}>
            <h2 className="text-3xl font-semibold text-lighttext mb-2 ">{title}</h2>
          </NavLink>
          <NavLink to={`/user/${username}`}>
            <p className="text-darktext text-xl hover:text-lighttext">{uploader}</p>
          </NavLink>
        </div>

        <p className="text-darktext text-lg line-clamp-3">{description}</p>
      </div>
    </div>
  );
}
