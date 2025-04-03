import { Outlet, useParams, NavLink } from "react-router-dom";
import { useFetchUserDetails } from "../../hooks/useUserHooks";
import UserContext from "../../contexts/userContext";
import {
  useCheckSubscriptionStatus,
  useFetchSubsciberCount,
  useToggleSubscription,
} from "../../hooks/useSubscriptionHooks";
import { useContext, useEffect, useState } from "react";

const ChannelDashboard = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [totalSubs, setTotalSubs] = useState(0);
  const { username } = useParams();
  const { loggedUser } = useContext(UserContext);
  const { user, loading, error } = useFetchUserDetails(username);
  const { fetchSubsCount } = useFetchSubsciberCount();

  const { loading: subscriptionLoading, toggleSubscription } =
    useToggleSubscription();

  const { checkSubscription, loading: subscriptionStatusLoading } =
    useCheckSubscriptionStatus();

  // Check whether the same logged user is using the dashboard of its own channel
  const isUserSame = user?.username === loggedUser?.username;

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const status = await checkSubscription({ username });
      setIsSubscribed(status);
    };

    const fetchTotalSubs = async () => {
      const subs = await fetchSubsCount({ username });
      setTotalSubs(subs);
    };

    if (loggedUser && user && loggedUser.username !== user.username) {
      fetchSubscriptionStatus();
      fetchTotalSubs();
    }
  }, [loggedUser, user, username, checkSubscription, fetchSubsCount, totalSubs]);

  const handleToggleSubscription = async () => {
    const response = await toggleSubscription(username);
    if (response) {
      setIsSubscribed(!isSubscribed);
      setTotalSubs(isSubscribed ? totalSubs - 1 : totalSubs + 1);
    }
  };

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
    <div className="bg-darkbg flex flex-col text-lighttext min-h-full">
      <div className="flex flex-col w-full justify-between h-full">
        {/* CoverImage */}
        <div className="bg-cover bg-center sm:h-65 h-32 flex justify-center items-center">
          <img
            src={user.coverImage || "https://placehold.co/600x400"}
            alt="coverImage"
            className="w-full h-full object-cover"
          />
        </div>

        {/* AvatarImage */}
        <div className="flex justify-items-start items-center mb-4">
          <img
            src={user.avatar}
            alt="avatarImage"
            className="sm:w-36 sm:h-36 w-20 h-20 ml-4.5 object-cover rounded-full -mt-24 sm:-mt-16 border-4 border-darkbg"
          />

          <div className="flex-col items-center justify-between w-full mr-6">
            <div className="ml-4.5">
              <h1 className="text-lighttext text-xl mt-2 sm:text-2xl">{user.fullname}</h1>
              <p className="text-darktext sm:text-lg mb-2">{`@${username} | ${totalSubs} subscriber/s`}</p>
            </div>
            {loggedUser ? (
              !isUserSame && (
                <button
                  className={`${
                    isSubscribed
                      ? "bg-lightbg hover:bg-lightbg/70"
                      : "hover:bg-highlight/70 bg-highlight"
                  } disabled:bg-lightbg/30 disabled:text-lighttext/30 sm:text-xl ml-4.5 m px-4 py-2 rounded`}
                  disabled={subscriptionLoading || subscriptionStatusLoading}
                  onClick={handleToggleSubscription}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              )
            ) : (
              <div className="bg-lightbg/20 text-lighttext/20 px-4 py-2 rounded">
                Login to Subscribe
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex">
          <NavLink
            to={`/user/${username}/videos`}
            className={({ isActive }) =>
              `sm:text-xl w-full text-center font-bold ml-4 py-2 rounded ${
                isActive ? "text-lighttext bg-lightbg" : "text-darktext"
              } lg:border-0 hover:text-highlight`
            }
          >
            Videos
          </NavLink>

          <NavLink
            to={`/user/${username}/tweets`}
            className={({ isActive }) =>
              `sm:text-xl w-full text-center font-bold py-2 rounded ${
                isActive ? "text-lighttext bg-lightbg" : "text-darktext"
              } lg:border-0 hover:text-highlight`
            }
          >
            Tweets
          </NavLink>

          <NavLink
            to={`/user/${username}/playlists`}
            className={({ isActive }) =>
              `sm:text-xl w-full text-center font-bold mr-4 py-2 rounded ${
                isActive ? "text-lighttext bg-lightbg" : "text-darktext"
              } lg:border-0 hover:text-highlight`
            }
          >
            Playlists
          </NavLink>
        </nav>

        {/* Outlet (Dynamic Content) */}
        <div className="flex-1 overflow-y-auto my-4 sm:mx-8 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChannelDashboard;