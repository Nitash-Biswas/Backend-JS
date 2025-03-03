import React from "react";
import { NavLink } from "react-router-dom";

export default function Card({ title = "No title", thumbnail = "No thumbnail", uploader = "Someone", videoId = "No videoId" }) {
  return (
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden">
      <NavLink to={`/video/${videoId}`}>
        <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
      </NavLink>
      <div className="p-4">
        <NavLink to={`/video/${videoId}`}>
          <h2 className="text-lg font-semibold text-lighttext">{title}</h2>
        </NavLink>
        <p className="text-darktext"> {uploader}</p>
      </div>
    </div>
  );
}