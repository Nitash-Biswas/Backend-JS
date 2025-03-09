import React from "react";
import { useParams } from "react-router-dom";
import { useFetchPlaylist } from "../../hooks/usePlaylistHooks";
import Card from "../Card/Card";
import { formatDuration } from "../../Utils/formatDuration";

function Playlist() {
  const { playlistId } = useParams();
  const { playlistData, error, loading } = useFetchPlaylist(playlistId);

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
  console.log(playlistData);
  return (
    <>
      <div className="bg-darkbg min-h-full p-4">
        <div className="flex flex-col">
          <p className="text-4xl font-bold text-lighttext mb-2">
            {playlistData.name}
          </p>

          <p className="text-xl font-bold text-darktext mb-20">
            {playlistData.description}
          </p>

          <p className="text-md font-bold text-darktext mb-4">
            {playlistData.videos.length > 1
              ? `${playlistData.videos.length} videos`
              : `${playlistData.videos.length} video`}
          </p>
        </div>
        <div className="bg-darkbg">
          {playlistData.videos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {playlistData.videos.map((video) => (
                <Card
                  key={video._id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  uploader={video.owner.fullname}
                  videoId={video._id}
                  duration={formatDuration(video.duration)}
                  description={video.description}
                  username={video.owner.username}
                  avatar={video.owner.avatar}
                />
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
      </div>
    </>
  );
}

export default Playlist;
