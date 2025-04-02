import React, { useContext } from "react";
import CommentCard from "../Card/CommentCard";
import { extractDate } from "../../Utils/extractDate";
import UserContext from "../../contexts/userContext";

function AllComments({ comments, loading, error, refresh }) {
  const { loggedUser } = useContext(UserContext);



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
    <div className="bg-darkbg overflow-y-scroll h-screen mt-4">
      {comments.length > 0 ? (
        <>


          <div className="grid grid-cols-1 gap-4">
            {comments.map((comment) => (
              <CommentCard
                key={comment._id}
                content={comment.content}
                owner={comment.owner.username}
                date={extractDate(comment.createdAt)}
                avatar={comment.owner.avatar}
                loggedUser={loggedUser}
                commentId={comment._id}
                onCommentUpdated={refresh}
                onCommentDeleted={refresh}
              />
            ))}
          </div>


        </>
      ) : (
        <div className="flex flex-col items-center ">
          <h1 className="text-darktext text-2xl">No comments yet.</h1>
        </div>
      )}
    </div>
  );
}

export default AllComments;