import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import axios from "axios";
import { BASE_URL, VIDEOS_URL } from "../../constants";
import { formatDuration } from "../../Utils/formatDuration";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${VIDEOS_URL}/get_all_videos`
        );
        setVideos(response.data?.data.allVideos);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="bg-darkbg text-2xl text-lighttext min-h-full p-4">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-darkbg text-2xl min-h-full text-highlight p-4">Error: {error}</div>
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
              uploader={video.owner.ownerName}
              videoId={video._id}
              duration={formatDuration(video.duration) }
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
  );
}
