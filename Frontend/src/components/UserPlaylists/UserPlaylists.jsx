import React from "react";

import Card from "../Card/Card";
import { useFetchUserPlaylists } from "../../hooks/usePlaylistHooks";
import { useParams } from "react-router-dom";
import PlaylistCard from "../Card/PlaylistCard";

// import cardDummyDataGen from "../../Utils/cardDummyDataGen";

// const videos = cardDummyDataGen(0, false);



function UserPlaylists() {
  // Custom hook to fetch all videos
  const {username} = useParams()
  const { playlists, loading, error } = useFetchUserPlaylists(username);

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
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              title={playlist.name}
              thumbnail={playlist.thumbnail}
              uploader={playlist.owner.ownerName}
              playlistId={playlist._id}
              description={playlist.description}

            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <h1 className="text-darktext text-2xl">No playlists found</h1>
          <p className="text-darktext">There are no playlists available.</p>
        </div>
      )}
    </div>
  );
}

export default UserPlaylists;
