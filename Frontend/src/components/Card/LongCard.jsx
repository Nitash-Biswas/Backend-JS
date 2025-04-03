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
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden flex flex-col lg:flex-row">
      <NavLink to={`/video/${videoId}`} className="flex-shrink-0">
        <img
          src={thumbnail}
          alt={title}
          className=" h-auto w-full lg:w-96 object-cover"
        />
      </NavLink>
      <div className="p-4 flex flex-1 flex-col justify-between ">
        <div>
          <div className="flex justify-between items-center relative">
            <NavLink to={`/video/${videoId}`}>
              <h2 className="text-3xl font-semibold text-lighttext mb-2 ">
                {title}
              </h2>
            </NavLink>
            {loggedUser && <button
              className="absolute top-0 right-0 text-2xl text-darktext hover:text-lighttext "
              onClick={onRemove}
            >
              <IoClose size={30} />
            </button>}
          </div>

          <p className="text-darktext text-xl hover:text-lighttext">
            <NavLink to={`/user/${username}`}>{uploader}</NavLink>
          </p>
        </div>

        <p className="text-darktext text-lg line-clamp-3">{description}</p>
      </div>
    </div>
  );
}
