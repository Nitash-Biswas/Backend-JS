import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchPlaylist,
  useManagePlaylist,
  useManageVideosInPlaylist,
} from "../../hooks/usePlaylistHooks";
import Card from "../Card/Card";
import { formatDuration } from "../../Utils/formatDuration";
import { IoClose } from "react-icons/io5";
import UserContext from "../../contexts/userContext";

function Playlist() {
  const { playlistId } = useParams();
  const { loggedUser } = useContext(UserContext);
  const { playlistData, error, loading, refresh } = useFetchPlaylist(playlistId);
  const {
    deletePlaylist,
    loading: deleteLoading,
    error: deleteError,
  } = useManagePlaylist();
  const {removeVideoFromPlaylist, loading: removeLoading, error: removeError} = useManageVideosInPlaylist();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showVideoDelete, setShowVideoDelete] = useState(false);
  const navigate = useNavigate();
  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };
  const handleDelete = () => {
    setShowConfirmDelete(true);
  };
  if (loading) {
    return (
      <div className="bg-darkbg text-2xl text-lighttext min-h-full p-4">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-darkbg text-2xl min-h-full text-highlight p-4">
        Error: {error}
      </div>
    );
  }

  const handleDeletePlaylist = async () => {
    await deletePlaylist(playlistId);
    navigate(-1);
  };

  const handleManageVideos = () => {
    setShowVideoDelete((prev) => !prev);
  };

  const handleRemoveVideo = async (videoId) => {
    const response = await removeVideoFromPlaylist(playlistId, videoId);
    refresh();
    // If the playlist has only one video while deleting, delete the playlist as well
    if(response && playlistData.videos.length === 1){
      await deletePlaylist(playlistId);
      navigate(-1);
    }

  };

  console.log(playlistData, loggedUser);
  return (
    <>
      <div className="bg-darkbg min-h-full p-4">
        <div className="flex justify-between mb-20">
          <div className="flex flex-col">
            <p className="text-4xl font-bold text-lighttext mb-2">
              {playlistData.name}
            </p>

            <p className="text-xl font-bold text-darktext ">
              {playlistData.description}
            </p>
          </div>
          {loggedUser?._id === playlistData?.owner && (
            <div className="flex flex-col gap-2">
              <button
                className="bg-red-500 hover:bg-red-500/70 text-lighttext px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete Playlist
              </button>
              <button
                className="bg-lightbg text-lighttext px-4 py-2 rounded hover:bg-lightbg/70"
                onClick={handleManageVideos}
              >
                {showVideoDelete ? "Save Changes" : "Manage Videos"}
              </button>
            </div>
          )}
        </div>
        <p className="text-md font-bold text-darktext mb-4">
          {playlistData.videos.length > 1
            ? `${playlistData.videos.length} videos`
            : `${playlistData.videos.length} video`}
        </p>
        <div className="bg-darkbg">
          {playlistData.videos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {playlistData.videos.map((video) => (
                <div key={video._id} className="relative">
                  <Card
                    title={video.title}
                    thumbnail={video.thumbnail}
                    uploader={video.owner.fullname}
                    videoId={video._id}
                    duration={formatDuration(video.duration)}
                    description={video.description}
                    username={video.owner.username}
                    avatar={video.owner.avatar}
                  />
                  {showVideoDelete && (
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-lighttext p-2 m-1 rounded"
                      onClick={() =>{handleRemoveVideo(video._id)}}
                    >
                      <IoClose size={35} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center ">
              <h1 className="text-darktext text-2xl">No Videos found</h1>
              <p className="text-darktext">
                There are no videos in playlist available.
              </p>
            </div>
          )}
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
                    onClick={handleDeletePlaylist}
                    className="bg-red-600 text-lighttext px-4 py-2 rounded hover:bg-red-600/70 disabled:bg-red-600/50"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </>
  );
}

export default Playlist;
