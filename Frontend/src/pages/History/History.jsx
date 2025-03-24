import React, { useContext } from "react";
// import cardDummyDataGen from "../../Utils/cardDummyDataGen";
import LongCard from "../../components/Card/LongCard";
import {
  useEditWatchHistory,
  useGetWatchHistory,
} from "../../hooks/useUserHooks";
import UserContext from "../../contexts/userContext";

function History() {
  // const videos = cardDummyDataGen(5, true);
  const { loggedUser } = useContext(UserContext);
  const {
    watchHistory,
    refresh,
    loading,
    error,
  } = useGetWatchHistory();

  const { clearWatchHistory, removeFromWatchHistory } = useEditWatchHistory();

  const handleClearWatchHistory = async () => {
    await clearWatchHistory();
    refresh();
  };

  const handleRemoveFromWatchHistory = async (videoId) => {
    await removeFromWatchHistory({ videoId });
    refresh();
  };

  return (
    <div className="bg-darkbg text-lighttext p-4 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center pb-8 pt-4 px-4">
        <h1 className="text-4xl font-bold">Watch History</h1>
        <button
          className="text-xl pr-2 text-darktext hover:text-lighttext cursor-pointer"
          onClick={handleClearWatchHistory}
        >
          Clear watch history
        </button>
      </div>

      {/* Cards Section */}
      <div className="flex-1 overflow-y-auto mr-4">
        {watchHistory?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 px-4">
            {watchHistory?.slice().reverse().map((video) => (
              <LongCard
                key={video._id}
                title={video.title}
                thumbnail={video.thumbnail}
                uploader={video.owner.fullname}
                videoId={video._id}
                description={video.description}
                username={video.owner.username}
                loggedUser={loggedUser}
                onRemove={() => handleRemoveFromWatchHistory(video._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-darktext text-2xl">No videos found</h1>
            <p className="text-darktext">There are no videos available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
