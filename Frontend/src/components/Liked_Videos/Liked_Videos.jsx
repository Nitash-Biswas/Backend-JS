//Show Watch History

import React from "react";
import LongCard from "../Card/LongCard";
import cardDummyDataGen from "../../Utils/cardDummyDataGen";

const videos = cardDummyDataGen(5,true);

function Liked_Videos() {
  return (
    <div className="bg-darkbg min-h-full text-lighttext p-4">
      <div className="flex justify-between items-center pb-8 pt-4">
        <h1 className="text-4xl font-bold">Liked Videos</h1>
      </div>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {videos.map((video) => (
            <LongCard
              key={video.videoId}
              title={video.title}
              thumbnail={video.thumbnail}
              uploader={video.uploader}
              videoId={video.videoId}
              description={video.description}
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

export default Liked_Videos;
