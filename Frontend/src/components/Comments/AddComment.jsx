import React, { useRef, useState } from "react";
import { useAddComment, useFetchComments } from "../../hooks/useCommentHooks";

function AddComment({ videoId, username, avatar, onCommentAdded }) {
  const [comment, setComment] = useState("");
  const { addComment, loading, error } = useAddComment();

  const textareaRef = useRef(null);

  // console.log("AddComment");
  const handleSubmit = async (event) => {
    event.preventDefault();
    await addComment({ videoId: videoId, comment });
    setComment("");
    //An arbitrary function onCommentAdded() will be executed
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
    console.log("Comment added");
    // Safely call onCommentAdded if it exists
    if (typeof onCommentAdded === 'function') {
      onCommentAdded();
    }
  };

  // Function to adjust the height of the textarea dynamically
  const handleInput = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height to auto to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
  };

  return (
    <div className="bg-lightbg shadow-xl p-4 rounded w-full ">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-start w-full">

          <div className="flex flex-col ml-4 w-full sm:w-auto flex-grow">
            <textarea
              ref={textareaRef}
              className="text-lg text-lighttext border-b-4 border-darktext
              placeholder:text-darktext p-2 mb-2 resize-none overflow-hidden w-full"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onInput={handleInput} // Trigger height adjustment on input
              placeholder="Add a comment..."
              required
              rows={1} // Start with one row
              style={{ minHeight: "40px" }} // Set a minimum height
            />
            <div className="flex justify-between mt-2">
            <img
            src={avatar}
            alt={username}
            className="w-12 h-12 object-cover rounded-full"
          />
              <button
                type="submit"
                disabled={loading}
                className="bg-highlight hover:bg-highlight/80 text-lg text-lighttext py-2 px-6 rounded-lg cursor-pointer"
              >
                {loading ? "..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default AddComment;
