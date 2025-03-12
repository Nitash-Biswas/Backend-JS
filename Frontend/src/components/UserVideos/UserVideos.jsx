import React, { useContext, useState } from "react";

import Card from "../Card/Card";
import { useFetchUserVideos } from "../../hooks/useVideoHooks";
import { formatDuration } from "../../Utils/formatDuration";
import { useParams } from "react-router-dom";
import UserContext from "../../contexts/userContext";
// import cardDummyDataGen from "../../Utils/cardDummyDataGen";

// const videos = cardDummyDataGen(0, false);

function UserVideos() {
  const username = useParams().username;
  const [refresh, setRefresh] = useState(false);
  // Custom hook to fetch all videos
  const { videos, loading, error } = useFetchUserVideos(username, refresh);
  const { loggedUser } = useContext(UserContext);

  const handleRefresh = () => {
    setRefresh(prev => !prev)
  }

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
    <div className="bg-darkbg min-h-full p-4">
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <Card
              key={video._id}
              title={video.title}
              thumbnail={video.thumbnail}
              avatar={video.owner.avatar}
              uploader={video.owner.ownerName}
              username={video.owner.username}
              videoId={video._id}
              duration={formatDuration(video.duration)}
              loggedUser={loggedUser}
              onVideoEdit={handleRefresh}
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
  );
}

export default UserVideos;
