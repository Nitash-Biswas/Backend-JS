import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen sticky top-0 bg-darkbg text-white w-64">
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
            to="/github"
            className={({ isActive }) =>
              `text-xl font-bold hover:bg-lightbg px-4 py-2 rounded
                ${
                  isActive ? "text-highlight" : "text-darktext"
                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
            }
          >
            Github
          </NavLink>

        </nav>
      </div>
    </div>
  );
}
