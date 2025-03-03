import React from "react";
import Card from "../Card/Card";

const cardDummyDataGen = (number) => {
  let data = [];
  for (let i = 1; i < number + 1; i++) {
    data.push({
      videoId: i,
      title: `Video ${i}`,
      thumbnail: "https://placehold.co/600x400",
      uploader: `Uploader ${i}`,
    });
  }
  return data;
};

const videos = cardDummyDataGen(0);

export default function Home() {
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
