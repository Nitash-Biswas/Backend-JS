import React from "react";
import { Link, NavLink } from "react-router-dom";

const isloggedIn = true;

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
          <div className="flex items-center lg:order-2">
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
                <Link
                  to="#"
                  className="text-darktext  hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Log in
                </Link>
                <Link
                  to="#"
                  className="text-white bg-lightbg hover:bg-highlight focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
