import React from "react";

import Card from "../Card/Card";
import {  useFetchUserVideos } from "../../hooks/useVideoHooks";

function MyVideos() {
  // Custom hook to fetch all videos
  const { videos, loading, error } = useFetchUserVideos();

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
              key={video.videoId}
              title={video.title}
              thumbnail={video.thumbnail}
              uploader={video.uploader}
              videoId={video.videoId}
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

export default MyVideos;
