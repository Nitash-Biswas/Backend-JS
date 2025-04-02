import React, { useState, useRef } from "react";
import { useAddTweet } from "../../hooks/useTweetHooks";

function AddTweet({ username, avatar, onAddTweet }) {
  const [content, setContent] = useState("");
  const { addTweet, loading, error } = useAddTweet();
  const textareaRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addTweet({ tweet: content });
    setContent("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
    onAddTweet();
  };

  // Function to adjust the height of the textarea dynamically
  const handleInput = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="bg-lightbg shadow-xl p-4 rounded ">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center w-full">
          <img
            src={avatar}
            alt={username}
            className="w-16 h-16 object-cover rounded-full"
          />
          <div className="flex flex-col ml-4 w-full">
            <textarea
              ref={textareaRef}
              className="text-lg text-lighttext border-b-4 border-darktext items-center
              placeholder:text-darktext p-2 mb-2 resize-none overflow-hidden"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onInput={handleInput}
              placeholder="Add a tweet..."
              required
              rows={1}
              style={{ minHeight: "40px", height: "40px" }}
            />
            <div className="flex justify-end">
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

export default AddTweet;