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
  const { fetchSubsCount } = useFetchSubsciberCount(username);

  const { loading: subscriptionLoading, toggleSubscription } =
    useToggleSubscription();

  const {
    checkSubscription,
    loading: subscriptionStatusLoading,
  } = useCheckSubscriptionStatus();

  // Check whether the same logged user is using the dashboard of its own channel
  const isUserSame = user?.username === loggedUser?.username;
  // console.log({ isUserSame: isUserSame });

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const status = await checkSubscription({ username });
      // console.log({ status: status });
      setIsSubscribed(status);
    };

    const fetchTotalSubs = async () => {
      const subs = await fetchSubsCount({ username });
      setTotalSubs(subs);
    };

    if (
      loggedUser &&
      user &&
      loggedUser.username !== user.username &&
      totalSubs > 0
    ) {
      fetchSubscriptionStatus();
      fetchTotalSubs();
    }
  }, [
    loggedUser,
    user,
    username,
    checkSubscription,
    fetchSubsCount,
    totalSubs,
  ]);

  // if (user && loggedUser) {
  //   console.log({ user: user, loggedUser: loggedUser });
  // }

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
    <div className="bg-darkbg flex flex-col text-lighttext min-h-screen">
      <div className="flex flex-col w-full justify-between">
        {/* CoverImage */}
        <div className="bg-cover bg-center h-65 flex justify-center items-center">
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
            className="w-36 h-36 ml-4.5 object-cover rounded-full -mt-16 border-4 border-darkbg"
          />

          <div className="flex items-center justify-between w-full mr-6">
            <div className="ml-4.5">
              <h1 className="text-lighttext text-2xl">{user.fullname}</h1>
              <p className="text-darktext text-lg">{`@${username} | ${totalSubs} subscriber/s`}</p>
            </div>
            {loggedUser ? (
              !isUserSame && (
                <button
                  className={`${
                    isSubscribed
                      ? "bg-lightbg hover:bg-lightbg/70"
                      : "hover:bg-highlight/70 bg-highlight"
                  } disabled:bg-lightbg/30 disabled:text-lighttext/30 text-xl px-4 py-2 rounded`}
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

        <nav className="flex flex-col lg:flex-row">
          <NavLink
            to={`/user/${username}/videos`}
            className={({ isActive }) =>
              `text-xl w-full text-center font-bold mx-4 py-2 rounded ${
                isActive ? "text-lighttext bg-lightbg" : "text-darktext"
              } lg:border-0 hover:text-highlight`
            }
          >
            Videos
          </NavLink>

          <NavLink
            to={`/user/${username}/tweets`}
            className={({ isActive }) =>
              `text-xl w-full text-center font-bold mx-4 py-2 rounded ${
                isActive ? "text-lighttext bg-lightbg" : "text-darktext"
              } lg:border-0 hover:text-highlight`
            }
          >
            Tweets
          </NavLink>

          <NavLink
            to={`/user/${username}/playlists`}
            className={({ isActive }) =>
              `text-xl w-full text-center font-bold mx-4 py-2 rounded ${
                isActive ? "text-lighttext bg-lightbg" : "text-darktext"
              } lg:border-0 hover:text-highlight`
            }
          >
            Playlists
          </NavLink>
        </nav>

        <div className="mt-8 w-full h-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChannelDashboard;
