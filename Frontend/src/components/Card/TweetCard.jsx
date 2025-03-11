import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useUpdateAndDeleteTweet } from "../../hooks/useTweetHooks";
function TweetCard({
  content,
  owner,
  date,
  avatar,
  loggedUser,
  tweetId,
  onTweetUpdated,
  onTweetDeleted,
}) {
const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const { updateTweet, deleteTweet, loading, error } =
  useUpdateAndDeleteTweet();

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

    const handleUpdate = async () => {
      await updateTweet({ tweetId, newContent: newContent });
      setIsEditing(false);
      if (onTweetUpdated) {
        onTweetUpdated();
      }
    };

    const handleDelete = async () => {
      await deleteTweet({ tweetId });
      if (onTweetDeleted) {
        onTweetDeleted();
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
                <p className="text-darktext text-sm hover:text-lighttext">{`@${owner}`}</p>
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

        {loggedUser && loggedUser.username === owner && (
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="hover:text-lighttext text-darktext pr-4 py-2 "
            >
              <FaEdit size={25} />
            </button>
            <button
              onClick={handleDelete}
              className="hover:text-red-500 text-darktext   py-2"
            >
              <MdDelete size={25} />
            </button>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
}

export default TweetCard;
