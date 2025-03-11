//Show subscribers and channels subscribed to

import React, { useContext, useState } from "react";
import UserContext from "../../contexts/userContext";
import {
  useFetchSubscibers,
  useFetchSubscribed,
} from "../../hooks/useSubscriptionHooks";
import Subscribers from "../../components/UserSubscribers/Subscribers";
import SubscribedTo from "../../components/UserSubscribers/SubscribedTo";

function Stats() {
  const { loggedUser } = useContext(UserContext);
  const { subscribers, subscribersCount } = useFetchSubscibers(
    loggedUser?.username
  );
  const { subscribed, subscribedCount } = useFetchSubscribed();
  // console.log({ subscribed, subscribedCount, loggedUser });

  // console.log({ subscribers, subscribersCount });

  const [selectedComponent, setSelectedComponent] = useState("Subscribers");
  const handleSelect = (component) => {
    setSelectedComponent(selectedComponent === component ? null : component);
  };

  return (
    <div className="bg-darkbg min-h-full text-lighttext">
      {/* CoverImage */}
      <div className="bg-cover bg-center h-65 flex justify-center items-center">
        <img
          src={loggedUser?.coverImage || "https://placehold.co/600x400"}
          alt="coverImage"
          className="w-full h-full object-cover"
        />
      </div>
      {/* AvatarImage */}
      <div className="flex justify-items-start items-center">
        <img
          src={loggedUser?.avatar || "https://placehold.co/150x150"}
          alt="avatarImage"
          className="w-36 h-36 ml-4.5 object-cover rounded-full -mt-16 border-4 border-darkbg"
        />
        <div className="ml-4.5">
          <h1 className="text-lighttext text-2xl">{`${loggedUser?.fullname}`}</h1>
          <p className="text-darktext text-lg">{`@${loggedUser?.username}`}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full justify-between">
        <div
          className={` hover:text-highlight w-1/2 text-darktext text-xl flex
            justify-center items-center m-4 p-4 rounded-lg cursor-pointer ${
            selectedComponent === "Subscribers"
              ? "bg-lightbg text-lighttext"
              : "bg-transparent"
          }`}
          onClick={() => {
            handleSelect("Subscribers");
          }}
        >
          <h1>Subscribers : {subscribersCount}</h1>
        </div>

        <div
          className={` hover:text-highlight w-1/2 text-darktext text-xl flex
            justify-center items-center m-4 p-4 rounded-lg cursor-pointer ${
            selectedComponent === "Subscribed"
              ? "bg-lightbg text-lighttext"
              : "bg-transparent"
          }`}
          onClick={() => {
            handleSelect("Subscribed");
          }}
        >
          <h1>Channels Subscribed : {subscribedCount}</h1>
        </div>
      </div>
      <div className="mt-8 w-full min-h-full">
        {selectedComponent === "Subscribers" && (
          <Subscribers subscribers={subscribers} />
        )}
        {selectedComponent === "Subscribed" && (
          <SubscribedTo channels={subscribed} />
        )}
      </div>
    </div>
  );
}

export default Stats;
