import React from "react";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";

export default function LongCard({
  title = "No title",
  thumbnail = "No thumbnail",
  uploader = "Someone",
  videoId = "No videoId",
  description = "No description",
  username = "N/A",
  loggedUser = null,
  onRemove,
}) {
  return (
    <div className="bg-lightbg shadow-md rounded-lg w-full flex flex-col lg:flex-row">
  <NavLink to={`/video/${videoId}`} className="flex-shrink-0">
    <img
      src={thumbnail}
      alt={title}
      className="h-auto w-full lg:w-96 object-cover"
    />
  </NavLink>

  <div className="p-4 flex flex-col w-full min-w-0 justify-between">
    <div className="flex items-start justify-between min-w-0">
      <NavLink to={`/video/${videoId}`} className="min-w-0 max-w-[calc(100%-30px)]">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-lighttext mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h2>
      </NavLink>

      {loggedUser && (
        <button
          className="text-2xl text-darktext hover:text-lighttext flex-shrink-0 ml-2"
          onClick={onRemove}
        >
          <IoClose size={30} />
        </button>
      )}
    </div>

    <p className="text-darktext text-xl hover:text-lighttext min-w-0 whitespace-nowrap overflow-hidden hover:text-ellipsis">
      <NavLink to={`/user/${username}`}>{uploader}</NavLink>
    </p>

    <p className="text-darktext text-lg min-w-0 truncate">
      {description}
    </p>
  </div>
</div>
  );
}
