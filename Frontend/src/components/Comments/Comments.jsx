import React from "react";
import { useFetchComments } from "../../hooks/useCommentHook";
import CommentCard from "../Card/CommentCard";

import { extractDate } from "../../Utils/extractDate";

// const tweets = [
//   {
//     tweetId: 1,
//     content: "This is a tweet",
//     owner: "John Doe",
//     date: "2021-09-01",
//   },
// ];

function Comments({ videoId }) {
  // Custom hook to fetch all videos
  const { comments, loading, error } = useFetchComments(videoId);

  if (loading) {
    return (
      <div className="bg-darkbg text-2xl text-lighttext min-h-full p-4">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-darkbg text-2xl min-h-full text-highlight p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-darkbg p-4">
      {comments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              content={comment.content}
              owner={comment.owner.username}
              date={extractDate(comment.createdAt)}
              avatar={comment.owner.avatar}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <h1 className="text-darktext text-2xl">No comments yet.</h1>
        </div>
      )}
    </div>
  );
}

export default Comments;
