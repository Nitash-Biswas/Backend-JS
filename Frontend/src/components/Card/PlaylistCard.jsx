import React from "react";
import { NavLink } from "react-router-dom";

export default function PlaylistCard({
  title = "No title",
  thumbnail = "No thumbnail",
  uploader = "Someone",
  playlistId = "No videoId",
  description = "No description yet",
  username = "N/A",
}) {
  return (
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden relative">
      <NavLink to={`/playlist/${playlistId}`}>
        <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
      </NavLink>
      <div className="p-4">
        <NavLink to={`/playlist/${playlistId}`}>
          <h2 className="text-lg font-semibold text-lighttext">{title}</h2>
        </NavLink>
        <NavLink to={`/user/${username}`}>
        <p className="text-darktext mb-4 hover:text-lighttext"> {uploader}</p>
        </NavLink>
        <p className="text-darktext"> {description}</p>
      </div>
    </div>
  );
}
