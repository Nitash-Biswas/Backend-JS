import React, { useState, useEffect, useRef } from "react";
import { useUpdateAndDeleteComment } from "../../hooks/useCommentHook";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import {
  useToggleLike,
  useCheckLike,
  useGetTotalLikes,
} from "../../hooks/useLikeHook";

function CommentCard({
  content,
  owner,
  date,
  avatar,
  loggedUser,
  commentId,
  onCommentUpdated,
  onCommentDeleted,
  onCommentLiked,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  // Custom hooks
  const { toggleCommentLike, loadingLike, errorLike } = useToggleLike();
  const { checkCommentLike, loadingLikeCheck, errorLikeCheck } = useCheckLike();
  const { getCommentLikes, loadingLikeCount, errorLikeCount } =
    useGetTotalLikes();
  const { updateComment, deleteComment, loading, error } =
    useUpdateAndDeleteComment();

  const textareaRef = useRef(null);

  // Function to adjust the height of the textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  };

  // Adjust textarea height when content changes
  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [newContent, isEditing]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const liked = await checkCommentLike({ commentId });
        setIsLiked(liked);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    const fetchTotalLikes = async () => {
      try {
        const likes = await getCommentLikes({ commentId });
        setTotalLikes(likes);
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };
    if(loggedUser){
      fetchLikeStatus();
    }

    fetchTotalLikes();
  }, [commentId, checkCommentLike, getCommentLikes, loggedUser]);

  const handleUpdate = async () => {
    await updateComment({ commentId, newContent: newContent });
    setIsEditing(false);
    if (onCommentUpdated) {
      onCommentUpdated();
    }
  };

  const handleDelete = async () => {
    await deleteComment({ commentId });
    if (onCommentDeleted) {
      onCommentDeleted();
    }
  };

  const handleLike = async () => {
    const response = await toggleCommentLike({ commentId });
    if (response) {
      setIsLiked(!isLiked);
      setTotalLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    }

    if (onCommentLiked) {
      onCommentLiked();
    }
  };

  return (
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden flex flex-col w-full p-4 relative">
      <div className="flex justify-center items-center">
        <NavLink to={`/user/${owner}`}>
          <img
            src={avatar || "https://placehold.co/150x150"}
            className="w-10 h-10 object-cover rounded-full"
            alt=""
          />
        </NavLink>
        <div className="flex flex-col justify-center ml-4 w-full">
          <div className="flex justify-between items-center">
            <NavLink to={`/user/${owner}`}>
              <p className="text-darktext text-sm">{`@${owner}`}</p>
            </NavLink>
            <span className="text-xs text-darktext">{date}</span>
          </div>

          {isEditing ? (
            <div className="flex flex-col">
              <textarea
                ref={textareaRef}
                className="text-lg font-semibold text-lighttext bg-darkbg p-2 rounded-md overflow-hidden resize-none"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={1} // Start with one row
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleUpdate}
                  className="bg-highlight hover:bg-highlight/80 text-lighttext px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewContent(content);
                  }}
                  className="bg-darkbg hover:bg-darkbg/80 text-lighttext px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <h2 className="text-lg font-semibold text-lighttext">{content}</h2>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div >
          {loggedUser && loggedUser.username === owner && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="hover:text-lighttext text-darktext pr-4 pt-2"
              >
                <FaEdit size={25} />
              </button>
              <button
                onClick={handleDelete}
                className="hover:text-red-500 text-darktext pt-2"
              >
                <MdDelete size={25} />
              </button>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <span className="pr-4 text-darktext text-lg font-bold">
            {totalLikes}
          </span>
          <button
            onClick={handleLike}
            className={` ${
              isLiked ? "text-highlight" : "text-darktext"
            } hover:text-lighttext disabled:text-darktext/30`}
            disabled={!loggedUser || loadingLike || loadingLikeCheck}
          >
            <AiFillLike size={25} />
          </button>
        </div>
      </div>
      {!loggedUser && <p className="text-sm text-right text-darktext/30">Login to like comments...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {errorLike && <p className="text-sm text-red-500">{errorLike}</p>}
      {errorLikeCheck && (
        <p className="text-sm text-red-500">{errorLikeCheck}</p>
      )}
      {errorLikeCount && (
        <p className="text-sm text-red-500">{errorLikeCount}</p>
      )}
    </div>
  );
}

export default CommentCard;
