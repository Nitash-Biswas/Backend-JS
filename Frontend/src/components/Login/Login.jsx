import React, { useContext, useEffect, useState } from "react";
import { useLoginUser } from "../../hooks/useUserHooks";
import UserContext from "../../contexts/userContext.js";
import { Navigate } from "react-router-dom";

function Login() {
  const { user, loading, error, loginUser } = useLoginUser();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visibleError, setVisibleError] = useState(null);
  const { loggedUser, setLoggedUser } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await loginUser({ email, username, password });
  };

  useEffect(() => {
    if (error) {
      setVisibleError(error);
      const timer = setTimeout(() => {
        setVisibleError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  useEffect(() => {
    console.log({user, loggedUser}); // Log user data when user state changes
    if (user) {
      setLoggedUser(user);
    }
  }, [user, loggedUser, setLoggedUser]);

  const togglePasswordVisibility = () => {
    let passwordInput = document.querySelector("#password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  };

  return (
    <div className="bg-darkbg text-2xl text-lighttext min-h-full p-4 flex justify-center items-center">
      <div className="bg-lightbg shadow-md rounded-lg p-8 w-full max-w-md">
        <p className="pb-3 text-center text-3xl font-semibold">Login</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="bg-darkbg text-lighttext px-2 py-1 text-lg rounded"
            type="text"
            value={email || username}
            required={true}
            placeholder="Email or Username"
            onChange={(e) => {
              setEmail(e.target.value);
              setUsername(e.target.value);
            }}
          />
          <input
            className="bg-darkbg text-lighttext px-2 py-1 text-lg rounded"
            id="password"
            type="password"
            value={password}
            required={true}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="text-lighttext text-sm flex items-center">
            <input
              type="checkbox"
              onClick={togglePasswordVisibility}
              className="mr-2"
            />
            Show Password
          </div>

          <button
            type="submit"
            disabled={loading}
            className="hover:bg-highlight hover:text-lighttext px-4 py-2 rounded border-4 border-highlight text-highlight font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {visibleError && (
            <p className="text-red-500 mt-4 flex justify-center">
              {visibleError}
            </p>
          )}
          {user && (
            <>
              <p className="text-green-500 mt-4 flex justify-center">
                Welcome, {user.fullname}!
              </p>
              <Navigate to="/" />
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
