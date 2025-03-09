import { Outlet, useParams, NavLink } from "react-router-dom";
import { useFetchUserDetails } from "../../hooks/useUserHooks";
import { useContext } from "react";
import UserContext from "../../contexts/userContext";
import { useFetchSubscibers } from "../../hooks/useSubscriptionHooks";

const ChannelDashboard = () => {
  const { username } = useParams();
  const { user, loading, error } = useFetchUserDetails(username);
  const { subscribersCount } = useFetchSubscibers(username);
  const { loggedUser } = useContext(UserContext);

  console.log({ user: user, loggedUser: loggedUser });
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
    <div className="bg-darkbg min-h-full text-lighttext">
      <div className="flex flex-col w-full justify-between">
        {/* CoverImage */}
        <div className="bg-cover bg-center h-96 flex justify-center items-center">
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

          <div className="flex items-center justify-between w-full mr-20">
            <div className="ml-4.5">
              <h1 className="text-lighttext text-2xl">{user.fullname}</h1>
              <p className="text-darktext text-lg">{`@${username} | ${subscribersCount} subscriber/s`}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col lg:flex-row">
          <NavLink
            to={`/user/${username}/videos`}
            className={({
              isActive,
            }) => `text-xl w-full text-center font-bold mx-4 py-2 rounded
            ${
              isActive ? "text-lighttext bg-lightbg" : "text-darktext"
            }  lg:border-0 hover:text-highlight`}
          >
            Videos
          </NavLink>

          <NavLink
            to={`/user/${username}/tweets`}
            className={({
              isActive,
            }) => `text-xl w-full text-center font-bold  mx-4 py-2 rounded
                    ${
                      isActive ? "text-lighttext bg-lightbg" : "text-darktext"
                    }  lg:border-0 hover:text-highlight`}
          >
            Tweets
          </NavLink>

          <NavLink
            to={`/user/${username}/playlists`}
            className={({
              isActive,
            }) => `text-xl w-full  text-center font-bold mx-4 py-2 rounded
                    ${
                      isActive ? "text-lighttext bg-lightbg" : "text-darktext"
                    }  lg:border-0 hover:text-highlight`}
          >
            Playlists
          </NavLink>
        </nav>

        <div className="mt-8 w-full min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChannelDashboard;
