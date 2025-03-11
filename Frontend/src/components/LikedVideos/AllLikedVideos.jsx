import React, { useContext } from "react";
import LikesContext from "../../contexts/likesContextProvider";
import LongCard from "../Card/LongCard";

function AllLikedVideos() {
  const { likedVideos, loading, error, refreshContext } =
    useContext(LikesContext);


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
  console.log(likedVideos);
  return (
    <div className="bg-darkbg min-h-full text-lighttext">

      {likedVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 px-4">
          {likedVideos.map((video) => (
            <LongCard
              key={video._id}
              title={video.video.title}
              thumbnail={video.video.thumbnail}
              uploader={video.likedBy.fullname}
              username={video.likedBy.username}
              videoId={video.video._id}
              description={video.video.description}
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

export default AllLikedVideos;
