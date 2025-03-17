import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/userContext";
import { useFetchSubsciberCount } from "../../hooks/useSubscriptionHooks";

function Profile() {
  const { loggedUser } = useContext(UserContext);
  const { fetchSubsCount } = useFetchSubsciberCount();
  const [totalSubs, setTotalSubs] = useState(0);

  useEffect(() => {
    const fetchSubsribersCount = async () => {
      if (loggedUser) {
        const subs = await fetchSubsCount({username: loggedUser.username});
        setTotalSubs(subs);
      }
    };

    fetchSubsribersCount();
  }, [fetchSubsCount, loggedUser]);

  if (!loggedUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-darkbg flex flex-col text-lighttext min-h-full">
      <div className="flex flex-col w-full justify-between">
        {/* CoverImage */}
        <div className="bg-cover bg-center h-65 flex justify-center items-center">
          <img
            src={loggedUser.coverImage || "https://placehold.co/600x400"}
            alt="coverImage"
            className="w-full h-full object-cover"
          />
        </div>

        {/* AvatarImage */}
        <div className="flex justify-items-start items-center mb-4 relative">
          <div className="ml-4.5 -mt-16">
            <img
              src={loggedUser.avatar}
              alt="avatarImage"
              className="w-36 h-36  object-cover rounded-full  border-4 border-darkbg"
            />
          </div>

          <div className="flex items-center justify-between mr-6">
            <div className="ml-4.5">
              <h1 className="text-lighttext text-5xl">{loggedUser.fullname}</h1>
              <p className="text-darktext text-lg">{`@${loggedUser.username}`}</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col">
          <div className="text-xl w-full font-bold mx-4 py-2 rounded">
            <span className="mr-2">Email :</span>
            <span className="text-darktext">{loggedUser.email}</span>
          </div>
          <div className="text-xl w-full font-bold mx-4 py-2 rounded">
            <span className="mr-2">Joined :</span>
            <span className="text-darktext">
              {new Date(loggedUser.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="text-xl w-full font-bold mx-4 py-2 rounded">
            <span className="mr-2">Subscribers :</span>
            <span className="text-darktext">
              {totalSubs}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;