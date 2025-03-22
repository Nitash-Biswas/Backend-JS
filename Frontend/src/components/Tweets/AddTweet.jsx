import React, { useContext, useState } from "react";
import { useAddTweet } from "../../hooks/useTweetHooks";
import TweetsContext from "../../contexts/tweetContextProvider";

function AddTweet({ username, avatar }) {
  const [content, setContent] = useState("");
  const { addTweet, loading, error } = useAddTweet();
  const { refreshTweets } = useContext(TweetsContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addTweet({ tweet: content });
    setContent("");
    //An arbitrary function onCommentAdded() will be executed
    refreshTweets();
  };

  // Function to adjust the height of the textarea dynamically
  const handleInput = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height to auto to recalculate
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
  };

  return (
    <div className="bg-lightbg shadow-xl p-4 mx-4 rounded ">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center w-full">
          <img
            src={avatar}
            alt={username}
            className="w-16 h-16 object-cover rounded-full"
          />
          <div className="flex flex-col ml-4 w-full">
            <textarea
              className="text-lg text-lighttext border-b-4 border-darktext items-center
              placeholder:text-darktext p-2 mb-2 resize-none overflow-hidden"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onInput={handleInput} // Trigger height adjustment on input
              placeholder="Add a tweet..."
              required
              rows={1} // Start with one row
              style={{ minHeight: "40px" }} // Set a minimum height
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
