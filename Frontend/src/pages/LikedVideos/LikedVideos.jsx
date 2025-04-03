import React, { useContext } from "react";
import LongCard from "../../components/Card/LongCard";
import UserContext from "../../contexts/userContext";
import { useFetchLikedVideos, useToggleLike } from "../../hooks/useLikeHooks";

function LikedVideos() {
  const { likedVideos, loading, error, refresh } = useFetchLikedVideos();
  const { toggleVideoLike } = useToggleLike();
  const { loggedUser } = useContext(UserContext);

  const handleRemove = async (videoId) => {
    await toggleVideoLike({ videoId });
    refresh();
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
  return (
    <div className="bg-darkbg text-lighttext p-4 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center pb-8 pt-4 px-4">
        <h1 className="text-4xl font-bold">Liked Videos</h1>


      </div>
      {/* Cards Section */}
      <div className="flex-1 overflow-y-auto mr-4">
      {likedVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 px-4">
          {likedVideos.map((video) => (
            <LongCard
              key={video._id}
              title={video.video.title}
              thumbnail={video.video.thumbnail}
              uploader={video.ownerDetails.fullname}
              username={video.ownerDetails.username}
              videoId={video.video._id}
              description={video.video.description}
              loggedUser={loggedUser}
              onRemove={() => {
                handleRemove(video.video._id);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <h1 className="text-darktext text-2xl">No videos found</h1>
          <p className="text-darktext">There are no videos available.</p>
        </div>
      )}
      </div>
    </div>
  );
}

export default LikedVideos;
