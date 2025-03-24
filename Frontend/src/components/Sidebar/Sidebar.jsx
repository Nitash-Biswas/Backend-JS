import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import { FaComment, FaHeart, FaHistory, FaHome, FaUser, FaUsers } from "react-icons/fa";

export default function Sidebar() {
  const { loggedUser } = useContext(UserContext);

  return (
    <div className="h-screen sticky top-0 bg-darkbg text-white md:w-64 w-20 border-r-3 border-lightbg/30">
      <div className="flex flex-col items-center py-4">
        <nav className="flex flex-col space-y-2 w-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center justify-center md:justify-start gap-3 text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            <FaHome size={30} />
            <span className="hidden md:inline">Home</span>
          </NavLink>
          <NavLink
            to="/liked_videos"
            className={({ isActive }) =>
              `flex items-center justify-center md:justify-start gap-3 text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            <FaHeart size={30} />
            <span className="hidden md:inline">Liked Videos</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center justify-center md:justify-start gap-3 text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            <FaHistory size={30} />
            <span className="hidden md:inline">History</span>
          </NavLink>
          <NavLink
            to="/tweets"
            className={({ isActive }) =>
              `flex items-center justify-center md:justify-start gap-3 text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            <FaComment size={30} />
            <span className="hidden md:inline">Tweets</span>
          </NavLink>
          <NavLink
            to={loggedUser ? `/user/${loggedUser?.username}/videos` : "/no-auth-dashboard"}
            className={({ isActive }) =>
              `flex items-center justify-center md:justify-start gap-3 text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            <FaUser size={30} />
            <span className="hidden md:inline">Dashboard</span>
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `flex items-center justify-center md:justify-start gap-3 text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            <FaUsers size={30} />
            <span className="hidden md:inline">Stats</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}