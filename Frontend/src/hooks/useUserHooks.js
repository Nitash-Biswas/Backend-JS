import { useState } from "react";
import axios from "axios";
import { BASE_URL, USERS_URL } from "../constants";
import Cookies from "js-cookie";

export const useLoginUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async ({ email, username, password }) => {
    setLoading(true);

    try {
      // Make a POST request to the server
      const response = await axios.post(`${BASE_URL}${USERS_URL}/login`, {
        email,
        username,
        password,
      });
      // Set the user in the state
      setUser(response.data.data.user);
      //Store Tokens in Cookies
      Cookies.set("accessToken", response.data.data.accessToken);
      Cookies.set("refreshToken", response.data.data.refreshToken);
    } catch (err) {
        if (err.response?.status === 400) {
          setError("Incorrect username or password");
        } else {
          setError(err.response?.data?.message || "An error occurred");
        }
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, loginUser };
};
