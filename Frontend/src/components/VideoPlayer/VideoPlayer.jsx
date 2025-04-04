import React, { useContext, useEffect, useState, useCallback } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import getPublicId from "../../Utils/getPublicId";
import { AdvancedVideo } from "@cloudinary/react";
import { formatTimeAgo } from "../../Utils/formatTimeAgo";
import { useFetchVideo } from "../../hooks/useVideoHooks";
import UserContext from "../../contexts/userContext";
import AddComment from "../Comments/AddComment";

import {
  useCheckLike,
  useGetTotalLikes,
  useToggleLike,
} from "../../hooks/useLikeHooks";
import { AiFillLike } from "react-icons/ai";
import { IoAddCircle } from "react-icons/io5";
import AddToPlaylist from "../AddToPlaylist/AddToPlaylist";
import { useEditWatchHistory } from "../../hooks/useUserHooks";
import { useFetchComments } from "../../hooks/useCommentHooks";
import AllComments from "../Comments/AllComments";
import Pagination from "../Pagination/Pagination";

// Memoize the Comments, AddComment, and AdvancedVideo components

// How React.memo works:
// React.memo() is a higher-order component (HOC) that returns a memoized version of a component.
// It takes a component as an argument and returns a new component that wraps the original component and memoizes it.
// memoization is a technique used to optimize performance by caching the result of a function call
// and returning the cached result when the same arguments are passed again.
// const MemoizedComments = React.memo(Comments);
const MemoizedAdvancedVideo = React.memo(AdvancedVideo);

function VideoPlayer() {
  const { videoId } = useParams();
  const { loggedUser } = useContext(UserContext);
  const { videoData, error } = useFetchVideo(videoId); // Custom hook to fetch video data
  const [finalVideo, setFinalVideo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  // Custom hooks
  const { toggleVideoLike, loadingLike, errorLike } = useToggleLike();
  const { checkVideoLike, loadingLikeCheck, errorLikeCheck } = useCheckLike();
  const { getVideoLikes, loadingLikeCount, errorLikeCount } =
    useGetTotalLikes();
  const {
    addToWatchHistory,
    refresh,
    loading,
    error: watchHistoryError,
  } = useEditWatchHistory();
  const {
    comments,
    fetchComments,
    pagination,
    loading: commentsLoading,
    error: commentsError,
    refresh: commentsRefresh,
  } = useFetchComments(videoId);

  useEffect(() => {
    // Fetch like status
    const fetchLikeStatus = async () => {
      try {
        const liked = await checkVideoLike({ videoId });
        setIsLiked(liked);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    // Fetch total likes
    const fetchTotalLikes = async () => {
      try {
        const likes = await getVideoLikes({ videoId });
        setTotalLikes(likes);
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };
    // Check if the user is logged in
    if (loggedUser) {
      // console.log(loggedUser, videoId)
      fetchLikeStatus();
      addToWatchHistory({ videoId });
    }

    fetchTotalLikes();
  }, [videoId, checkVideoLike, getVideoLikes, loggedUser]);

  // Every time the videoData changes, update the finalVideo
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

  // We used useCallback to avoid unnecessary re-renders
  // useCallback is a higher-order function that returns a memoized version of a function
  // The memoized version will only re-render if the dependencies change
  const handleLike = useCallback(async () => {
    const response = await toggleVideoLike({ videoId });
    if (response) {
      setIsLiked(!isLiked);
      setTotalLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    }
  }, [isLiked, toggleVideoLike, videoId]);

  const handleAddToPlaylist = () => {
    setShowAddToPlaylist(true);
  };

  const handlePageChange = (newPage) => {
    fetchComments(newPage, pagination.limit);
  };

  // If the videoData or finalVideo is null, return a loading message
  if (!videoData || !finalVideo) {
    return (
      <div className="bg-darkbg text-2xl text-lighttext min-h-full p-8">
        Loading your Video...
      </div>
    );
  }

  // If there is an error, return an error message
  if (error) {
    return (
      <div className="bg-darkbg text-2xl min-h-full text-highlight p-8">
        Error in getting Video: {error}
      </div>
    );
  }

  return (
    <>
      <div className="bg-darkbg h-full p-8 flex flex-col lg:flex-row gap-8">
  {/* Video Section */}
  <div className="lg:w-3/5 w-full h-fit flex flex-col">
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden h-full">
      <MemoizedAdvancedVideo
        className="w-full h-auto aspect-video object-cover"
        cldVid={finalVideo.quality("auto")}
        controls
      />
      <div className="p-4">
        <h2 className="text-xl sm:text-3xl font-semibold text-lighttext mb-4 truncate">
          {videoData.title}
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center border-2 border-darktext rounded-full px-4 py-2">
            <span className="pr-4 text-darktext text-xl font-bold">
              {totalLikes}
            </span>
            <button
              onClick={handleLike}
              className={`${
                isLiked ? "text-highlight" : "text-darktext"
              } hover:text-lighttext disabled:text-darktext/30`}
              disabled={!loggedUser || loadingLike || loadingLikeCheck}
            >
              <AiFillLike size={30} />
            </button>
          </div>
          {loggedUser && (
            <button
              onClick={handleAddToPlaylist}
              className="flex items-center justify-center border-2 border-darktext rounded-full p-2 hover:text-lighttext text-darktext disabled:text-darktext/30"
              disabled={!loggedUser || loadingLike || loadingLikeCheck}
            >
              <IoAddCircle size={40} />
            </button>
          )}
        </div>
        <div className="flex items-center mb-4">
          <img
            src={videoData.owner.avatar}
            alt={videoData.owner.fullname}
            className="w-12 h-12 rounded-full mr-4"
          />
          <NavLink to={`/user/${videoData.owner.username}`}>
            <p className="text-lighttext text-lg">{videoData.owner.fullname}</p>
          </NavLink>
        </div>
        <p className="text-darktext text-sm mb-2">
          Uploaded: {formatTimeAgo(videoData.createdAt)}
        </p>
        <p className="text-darktext text-sm">{videoData.description}</p>
      </div>
    </div>
  </div>

  {/* Comments Section */}
  <div className="lg:w-2/5 w-full h-screen flex flex-col">
    <h1 className="text-2xl font-semibold text-lighttext mb-4">Comments</h1>
    {loggedUser && (
      <AddComment
        videoId={videoId}
        username={loggedUser.username}
        avatar={loggedUser.avatar}
        onCommentAdded={commentsRefresh}
      />
    )}
    <Pagination pagination={pagination} onPageChange={handlePageChange} />
    <AllComments
      comments={comments}
      loading={commentsLoading}
      error={commentsError}
      refresh={commentsRefresh}
    />
  </div>

  {showAddToPlaylist && (
    <AddToPlaylist
      videoData={videoData}
      onClose={() => setShowAddToPlaylist(false)}
    />
  )}
</div>
    </>
  );
}

export default VideoPlayer;
