import React from "react";
import { Link, NavLink } from "react-router-dom";

const isloggedIn = false;

export default function Header() {
  return (
    <header className="shadow-2xl sticky z-50 top-0">
      <nav className="bg-darkbg border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/src/assets/Logo3.png" className="mr-3 h-12" alt="Logo" />
          </Link>

          {/* Login and Register buttons */}
          <div className="flex items-center lg:order-2 gap-3">
            {isloggedIn && (
              <>
                <Link
                  to="#"
                  className="text-white bg-lightbg hover:bg-highlight focus:ring-4 focus:ring-orange-300 font-medium rounded-full text-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  + Create
                </Link>
                <Link
                  to="#"
                  className="text-white bg-lightbg hover:bg-highlight focus:ring-4 focus:ring-orange-300 font-medium rounded-full text-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  N
                </Link>
              </>
            )}
            {!isloggedIn && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-lg font-medium hover:bg-lightbg px-4 py-2 rounded
                                ${
                                  isActive
                                    ? "text-highlight "
                                    : "text-lighttext"
                                } lg:hover:bg-transparent lg:border-0 hover:text-highlight`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `text-lg font-medium hover:text-lighttext hover:bg-highlight px-4 py-2 rounded
                                ${
                                  isActive
                                    ? "text-lighttext bg-highlight "
                                    : "text-lighttext bg-lightbg"
                                }  lg:border-0`
                  }
                >
                  Register
                </NavLink>

              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
