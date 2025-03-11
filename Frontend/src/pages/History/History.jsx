//Show Watch History

import React from "react";

import cardDummyDataGen from "../../Utils/cardDummyDataGen";
import LongCard from "../../components/Card/LongCard";

const videos = cardDummyDataGen(5, true);

function History() {
  return (
    <div className="bg-darkbg min-h-full text-lighttext p-4">
      <div className="flex justify-between items-center pb-8 pt-4 px-4">
        <h1 className="text-4xl font-bold">Watch History</h1>
        <button className="text-xl pr-6 text-darktext hover:text-lighttext cursor-pointer">
          Clear watch history
        </button>
      </div>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 px-4">
          {videos.map((video) => (
            <LongCard
              key={video._id}
              title={video.title}
              thumbnail={video.thumbnail}
              uploader={video.uploader}
              videoId={video._id}
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

export default History;
