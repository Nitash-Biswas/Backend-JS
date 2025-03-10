import React, { useState } from "react";
import { useUpdateComment } from "../../hooks/useCommentHook";

function CommentCard({
  content,
  owner,
  date,
  avatar,
  loggedUser,

  commentId,
  onCommentUpdated,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const { updateComment, loading, error } = useUpdateComment();

  const handleUpdate = async () => {
    await updateComment({ commentId, newContent: newContent });
    setIsEditing(false);
    setShowDropdown(false);
    if (onCommentUpdated) {
      onCommentUpdated();
    }
  };

  return (
    <div className="bg-lightbg shadow-md rounded-lg overflow-hidden flex flex-col w-full p-4 relative">
      <div className="flex justify-center items-center">
        <img
          src={avatar || "https://placehold.co/150x150"}
          className="w-10 h-10 object-cover rounded-full"
          alt=""
        />
        <div className="flex flex-col justify-center ml-4 w-full">
          <div className="flex justify-between items-center">
            <p className="text-darktext text-sm">{`@${owner}`}</p>
            <span className="text-xs text-darktext">{date}</span>
            {loggedUser && loggedUser.username === owner && (
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-darktext text-sm"
              >
                ⋮
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="flex flex-col">
              <textarea
                className="text-lg font-semibold text-lighttext bg-darkbg p-2 rounded-md overflow-hidden"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleUpdate}
                  className="bg-highlight text-lighttext px-4 py-2 rounded-md mr-2"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewContent(content);
                  }}
                  className="bg-darkbg text-lighttext px-4 py-2 rounded-md"
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
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => {
                setIsEditing(true);
                setShowDropdown(false);
              }}
              className="block px-4 py-2 text-sm text-darktext hover:bg-highlight hover:text-lighttext"
            >
              Edit
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default CommentCard;
