//Show Watch History

import React, { useContext } from "react";
import LongCard from "../../components/Card/LongCard";
import UserContext from "../../contexts/userContext";
import AllLikedVideos from "../../components/LikedVideos/AllLikedVideos";




function LikedVideos() {
  const { loggedUser } = useContext(UserContext);

  return (

      <div className="bg-darkbg min-h-full text-lighttext p-4">
        <div className="flex justify-between items-center pb-8 pt-4 px-4">
          <h1 className="text-4xl font-bold">Liked Videos</h1>
        </div>
        {loggedUser && <AllLikedVideos />}
      </div>

  );
}

export default LikedVideos;
