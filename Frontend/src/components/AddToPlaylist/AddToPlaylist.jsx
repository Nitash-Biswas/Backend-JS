import React, { useContext, useEffect, useState } from "react";
import { useFetchVideo } from "../../hooks/useVideoHooks";
import LongCard from "../Card/LongCard";
import {
  useFetchUserPlaylists,
  useManagePlaylist,
  useManageVideosInPlaylist,
} from "../../hooks/usePlaylistHooks";
import { AiFillMinusCircle } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import UserContext from "../../contexts/userContext";

function AddToPlaylist({ videoData, onClose }) {
  const { loggedUser } = useContext(UserContext);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  // Fetch playlist data
  const {
    playlists,
    loading,
    error: playlistError,
    refresh,
  } = useFetchUserPlaylists(loggedUser.username);

  // Manage videos in playlist
  const {
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    loading: manageLoading,
    error: manageError,
  } = useManageVideosInPlaylist();

  const { createPlaylist, loading: createLoading, error }
  = useManagePlaylist();

  // Handle checkbox toggle
  const handleToggle = async (playlistId, isChecked) => {
    try {
      if (isChecked) {
        await addVideoToPlaylist(playlistId, videoData._id);
      } else {
        await removeVideoFromPlaylist(playlistId, videoData._id);
      }
      // Refresh playlist data after successful operation
      await refresh();
    } catch (error) {
      console.log(error);
    }
  };

  // Close dropdown
  const closeDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
    setNewDescription("");
    setNewTitle("");
  };

  const handleSave = async () => {
    const response = await createPlaylist({ name: newTitle, description: newDescription });
    console.log(response?._id);
    await addVideoToPlaylist(response?._id, videoData._id);
    await refresh();
    closeDropDown();
  };

//   console.log(playlists);

  if (playlistError) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
        <div className="bg-darkbg text-lighttext p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="mb-4">Failed to load video data.</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-lightbg text-lighttext px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30">
      <div className="bg-darkbg text-lighttext p-6 rounded-lg shadow-lg">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-xl font-semibold ">Add to Playlist</h2>
          <button
            className="text-xl font-semibold cursor-pointer "
            onClick={onClose}
          >
            <IoClose size={35} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Video</label>
          <LongCard
            title={videoData.title}
            thumbnail={videoData.thumbnail}
            uploader={videoData.owner.fullname}
            videoId={videoData._id}
            description={videoData.description}
            username={videoData.owner.username}
          />
        </div>
        <div className="mb-4">
          <div className="flex items-center flex-col bg-lightbg p-2 rounded-lg gap-2 mb-2">
            <button
              className="flex items-center w-full text-left rounded-lg
              gap-2 hover:text-highlight cursor-pointer"
              onClick={closeDropDown}
            >
              {isDropDownOpen ? (
                <AiFillMinusCircle size={35} />
              ) : (
                <AiFillPlusCircle size={35} />
              )}
              Create a playlist
            </button>
            {isDropDownOpen && (
              <>
                <input
                  type="text"
                  className="w-full p-2 border-2 border-darktext rounded-lg "
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-2 border-2 border-darktext rounded-lg"
                  placeholder="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                <div className="flex w-full justify-end">
                  <button
                    onClick={closeDropDown}
                    className="border-2 border-darktext hover:bg-darkbg/20 text-lighttext px-4 py-2 rounded mr-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={createLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-lighttext px-4 py-2 rounded cursor-pointer"
                  >
                    {createLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            )}
          </div>
          <label className="block text-sm font-medium mb-2">
            Add to Playlists
          </label>
          <div className="grid grid-cols-1 gap-2">
            {playlists.map((playlist) => {
              const hasVideo = playlist.videos?.some(
                (id) => id.toString() === videoData._id.toString()
              );

              return (
                <div
                  key={playlist._id}
                  className="flex items-center bg-lightbg p-2 px-4 rounded-lg"
                >
                  <input
                    type="checkbox"
                    id={playlist._id}
                    checked={hasVideo}
                    onChange={(e) =>
                      handleToggle(playlist._id, e.target.checked)
                    }
                    disabled={manageLoading}
                    className="mr-2"
                  />
                  <label htmlFor={playlist._id}>{playlist.name}</label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToPlaylist;
