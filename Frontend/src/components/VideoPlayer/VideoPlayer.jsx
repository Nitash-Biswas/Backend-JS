import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL, VIDEOS_URL } from "../../constants";
import { Cloudinary } from "@cloudinary/url-gen";
import getPublicId from "../../Utils/getPublicId";
import { AdvancedVideo } from "@cloudinary/react";

import { formatTimeAgo } from "../../Utils/formatTimeAgo";
import { useFetchVideo } from "../../hooks/useVideoHooks";
import UserTweets from "../UserTweets/UserTweets";

function VideoPlayer() {
  const { videoId } = useParams();
  const { videoData, error } = useFetchVideo(videoId); // Custom hook to fetch video data
  const [finalVideo, setFinalVideo] = useState(null);

  useEffect(() => {
    if (videoData) {
      // Create a new Cloudinary instance
      const cld = new Cloudinary({
        cloud: {
          cloudName: "dodyn9cen",
        },
      });
      // Get the public id of the video
      const publicId = getPublicId(videoData.videoFile);
      // Create a new video instance
      const video = cld.video(publicId);
      // Set the video to the state
      setFinalVideo(video);
    }
  }, [videoData]);

  console.log(videoData);
  // If videoData or finalVideo is not available, show a loading message
  if (!videoData || !finalVideo) {
    return (
      <div className="bg-darkbg text-2xl text-lighttext min-h-full p-4">
        Loading your Video...
      </div>
    );
  }
  // If there is an error, show the error message
  if (error) {
    return (
      <div className="bg-darkbg text-2xl min-h-full text-highlight p-4">
        Error in getting Video: {error}
      </div>
    );
  }

  return (
    <>
      <div className="sticky bg-darkbg min-h-full p-4 flex flex-col md:flex-row">
        <div className="md:w-3/5 w-full">
          <div className="bg-lightbg shadow-md rounded-lg  w-full max-w-full">
            <AdvancedVideo
              className="w-full h-192 object-cover"
              cldVid={finalVideo.quality("auto")}
              controls
            />
            <div className="p-4">
              <h2 className="text-3xl font-semibold text-lighttext mb-2">
                {videoData.title}
              </h2>
              <div className="flex items-center mb-2">
                <img
                  src={videoData.owner.avatar}
                  alt={videoData.owner.fullname}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <p className="text-lighttext text-xl">
                  {" "}
                  {videoData.owner.fullname}
                </p>
              </div>
              <p className="text-darktext text-lg mb-2">
                Uploaded: {formatTimeAgo(videoData.createdAt)}
              </p>
              <p className="text-darktext text-lg">{videoData.description}</p>
            </div>
          </div>
        </div>
        <div className="text-3xl md:w-2/5 w-full gap-4 pl-4 flex flex-col justify-start font-semibold text-lighttext">
          <h1 className="px-4">Comments</h1>
          <div className="overflow-auto h-220">
            <UserTweets />
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoPlayer;
