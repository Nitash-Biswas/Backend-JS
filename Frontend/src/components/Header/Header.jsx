import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import { useLogoutUser } from "../../hooks/useUserHooks";

export default function Header() {
  const { loggedUser } = useContext(UserContext);
  const logoutUser = useLogoutUser();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropDownOpen(!dropDownOpen);
  };
  const closeDropdown = () => {
    setDropDownOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    closeDropdown();
    navigate("/");
  };

  return (
    <header className="shadow-2xl sticky z-50 top-0">
      {/* Overlay to grey out the page */}
      {dropDownOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={closeDropdown}
        ></div>
      )}
      {/* Navbar */}
      <nav className="bg-darkbg border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/src/assets/Logo3.png" className="mr-3 h-12" alt="Logo" />
          </Link>

          {/* Login and Register buttons */}
          <div className="flex items-center lg:order-2 gap-3">
            {loggedUser && (
              <>
                <div
                  className="text-white bg-lightbg hover:bg-highlight focus:ring-4 focus:ring-orange-300
                font-medium rounded-full text-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  + Create
                </div>
                <div
                  className="text-white bg-lightbg hover:bg-highlight focus:ring-4 focus:ring-orange-300
                font-medium rounded-full text-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                  onClick={toggleDropdown}
                >
                  N
                  {dropDownOpen && (
                    <div className="absolute right-4 top-16 mt-2 w-48 bg-lightbg  rounded-md shadow-lg z-50 ">
                      <div className="py-1">
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 text-sm  text-darktext hover:bg-highlight text-lighttext "
                          onClick={closeDropdown}
                        >
                          Profile
                        </NavLink>
                        <NavLink
                          to="/settings"
                          className="block px-4 py-2 text-sm text-darktext hover:bg-highlight text-lighttext"
                          onClick={closeDropdown}
                        >
                          Settings
                        </NavLink>
                        <div
                          className="block px-4 py-2 text-sm text-darktext hover:bg-highlight hover:text-lighttext cursor-pointer"
                          onClick={handleLogout}
                        >
                          Logout
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {!loggedUser && (
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
