import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../../contexts/userContext";

export default function Sidebar() {
  const { loggedUser } = useContext(UserContext);

  return (
    <div className="h-screen sticky top-0 bg-darkbg text-white w-64 border-r-3 border-lightbg/30">
      <div className="flex flex-col items-center py-4">
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/liked_videos"
            className={({ isActive }) =>
              `text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            Liked Videos
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            History
          </NavLink>
          <NavLink
            to="/tweets"
            className={({ isActive }) =>
              `text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            Tweets
          </NavLink>
          <NavLink
            to={loggedUser ? `/user/${loggedUser?.username}/videos` : "/no-auth-dashboard"}
            className={({ isActive }) =>
              `text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            Stats
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
