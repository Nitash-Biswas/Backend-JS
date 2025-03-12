import React, { useContext, useEffect, useState, useCallback } from "react";
import { NavLink, useParams } from "react-router-dom";
import { BASE_URL, VIDEOS_URL } from "../../constants";
import { Cloudinary } from "@cloudinary/url-gen";
import getPublicId from "../../Utils/getPublicId";
import { AdvancedVideo } from "@cloudinary/react";
import { formatTimeAgo } from "../../Utils/formatTimeAgo";
import { useFetchVideo } from "../../hooks/useVideoHooks";
import UserTweets from "../UserTweets/UserTweets";
import Comments from "../Comments/AllComments";
import UserContext from "../../contexts/userContext";
import AddComment from "../Comments/AddComment";
import CommentsContext, {
  CommentsContextProvider,
} from "../../contexts/commentsContextProvider";
import { useCheckLike, useGetTotalLikes, useToggleLike } from "../../hooks/useLikeHook";
import { AiFillLike } from "react-icons/ai";

// Memoize the Comments, AddComment, and AdvancedVideo components
const MemoizedComments = React.memo(Comments);
const MemoizedAdvancedVideo = React.memo(AdvancedVideo);

function VideoPlayer() {
  const { videoId } = useParams();
  const { loggedUser } = useContext(UserContext);
  const { videoData, error } = useFetchVideo(videoId); // Custom hook to fetch video data
  const [finalVideo, setFinalVideo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  // Custom hooks
  const { toggleVideoLike, loadingLike, errorLike } = useToggleLike();
  const { checkVideoLike, loadingLikeCheck, errorLikeCheck } = useCheckLike();
  const { getVideoLikes, loadingLikeCount, errorLikeCount } = useGetTotalLikes();

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const liked = await checkVideoLike({ videoId });
        setIsLiked(liked);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    const fetchTotalLikes = async () => {
      try {
        const likes = await getVideoLikes({ videoId });
        setTotalLikes(likes);
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };
    if (loggedUser) {
      fetchLikeStatus();
    }

    fetchTotalLikes();
  }, [videoId, checkVideoLike, getVideoLikes, loggedUser]);

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

  const handleLike = useCallback(async () => {
    const response = await toggleVideoLike({ videoId });
    if (response) {
      setIsLiked(!isLiked);
      setTotalLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    }
  }, [isLiked, toggleVideoLike, videoId]);

  if (!videoData || !finalVideo) {
    return (
      <div className="bg-darkbg text-2xl text-lighttext min-h-full p-4">
        Loading your Video...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-darkbg text-2xl min-h-full text-highlight p-4">
        Error in getting Video: {error}
      </div>
    );
  }

  return (
    <>
      <CommentsContextProvider videoId={videoId}>
        <div className="bg-darkbg min-h-screen p-4 flex flex-col md:flex-row overflow-hidden">
          {/* Video Section */}
          <div className="md:w-3/5 w-full h-full">
            <div className="bg-lightbg shadow-md rounded-lg w-full">
              <MemoizedAdvancedVideo
                className="w-full h-full object-cover rounded-lg"
                cldVid={finalVideo.quality("auto")}
                controls
              />

              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-semibold text-lighttext mb-2">
                    {videoData.title}
                  </h2>
                  <div className="flex justify-center items-end pb-2">
                    <span className="pr-4 text-darktext text-2xl font-bold">
                      {totalLikes}
                    </span>
                    <button
                      onClick={handleLike}
                      className={` ${
                        isLiked ? "text-highlight" : "text-darktext"
                      } hover:text-lighttext disabled:text-darktext/30`}
                      disabled={!loggedUser || loadingLike || loadingLikeCheck}
                    >
                      <AiFillLike size={35} />
                    </button>
                  </div>
                </div>

                <NavLink to={`/user/${videoData.owner.username}`}>
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
                </NavLink>
                <p className="text-darktext text-lg mb-2">
                  Uploaded: {formatTimeAgo(videoData.createdAt)}
                </p>
                <p className="text-darktext text-lg">{videoData.description}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="md:w-2/5 w-full h-screen lg:pl-4 flex flex-col">
            <h1 className="text-3xl font-semibold text-lighttext px-4 lg:mb-4 my-4">
              Comments
            </h1>
            {loggedUser && (
              <AddComment
                videoId={videoId}
                username={loggedUser.username}
                avatar={loggedUser.avatar}
              />
            )}
            <div className="overflow-y-auto flex-1">
              <MemoizedComments />
            </div>
          </div>
        </div>
      </CommentsContextProvider>
    </>
  );
}

export default VideoPlayer;