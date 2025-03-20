import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";
import EditVideo from "../EditVideo/EditVideo";
import { useUpdateAndDeleteVideo } from "../../hooks/useVideoHooks";

export default function Card({
  title = "No title",
  thumbnail = "https://placehold.co/600x400",
  avatar = "No avatar",
  uploader = "N/A",
  username = "N/A",
  videoId = "No videoId",
  duration = "0:00",
  loggedUser = null,
  onVideoEdit,
  onVideoDelete,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditVideo, setShowEditVideo] = useState(false);
  const { deleteVideo, loadingChange } = useUpdateAndDeleteVideo();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  const closeOptions = () => {
    setShowOptions(false);
  };

  const handleEdit = () => {
    setShowEditVideo(true);
    setShowOptions(false);
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
    setShowOptions(false);
  };

  const confirmDelete = async () => {
    await deleteVideo({ videoId });
    setShowConfirmDelete(false);
    onVideoDelete();
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const closeEditVideo = () => {
    setShowEditVideo(false);
    onVideoEdit();
  };

  return (
    <div className="relative">
      {showOptions && (
        <div
          className="fixed inset-0 bg-black/70 z-20"
          onClick={closeOptions}
        ></div>
      )}
      <div
        className={`bg-lightbg shadow-md rounded-lg overflow-hidden relative ${
          showOptions ? "z-20" : ""
        }`}
      >
        <NavLink to={`/video/${videoId}`}>
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-40 right-2 bg-black/70 text-lighttext text-sm px-2 py-1 rounded">
            {duration}
          </div>
        </NavLink>
        <div className="p-4">
          <NavLink to={`/video/${videoId}`}>
            <h2 className="text-lg font-semibold text-lighttext">{title}</h2>
          </NavLink>
          <div className="flex items-center mt-2">
            <NavLink to={`/user/${username}/videos`}>
              <img
                src={avatar}
                alt={title}
                className="w-10 h-10 rounded-full mr-2"
              />
            </NavLink>
            <p className="text-darktext hover:text-lighttext">
              <NavLink to={`/user/${username}/videos`}>{uploader}</NavLink>
            </p>

            {
              // If the logged user is the owner of the video, show the options
              loggedUser && loggedUser.username === username && (
                <button
                  onClick={toggleOptions}
                  className="ml-auto text-darktext hover:text-lighttext"
                >
                  <SlOptionsVertical />
                </button>
              )
            }
          </div>
        </div>
        {
          // If showOptions is true, show the options
          showOptions && (
            <div className="absolute bottom-10 right-6 border-3 border-darktext/40 bg-lightbg text-lighttext shadow-lg rounded-lg z-40">
              <div className="py-1 ">
                <button
                  onClick={handleEdit}
                  className="block px-4 py-2 hover:bg-highlight w-full text-left"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="block px-4 py-2 hover:bg-highlight w-full text-left"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        }
      </div>
      {
        // If showConfirmDelete is true, show the delete confirmation box
        showConfirmDelete && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
            <div className="bg-darkbg text-lighttext p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-4">
                Are you sure you want to delete this video?
              </p>
              <div className="flex justify-end">
                <button
                  onClick={cancelDelete}
                  className="bg-lightbg text-lighttext px-4 py-2 rounded mr-2 hover:bg-lightbg/70"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-lighttext px-4 py-2 rounded hover:bg-red-600/70 disabled:bg-red-600/50"
                  disabled={loadingChange}
                >
                  {loadingChange ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )
      }
      {
        // If showEditVideo is true, show the edit video box
        showEditVideo && (
          <EditVideo videoId={videoId} onClose={closeEditVideo} />
        )
      }
    </div>
  );
}
