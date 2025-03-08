import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL, USERS_URL } from "../constants";
import UserContext from "../contexts/userContext";

export const useLoginUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async ({ email, username, password }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}${USERS_URL}/login`, {
        email,
        username,
        password,
      });

      const loggedInUser = response.data.data.user;

      setUser(loggedInUser);

      Cookies.set("accessToken", response.data.data.accessToken);
      Cookies.set("refreshToken", response.data.data.refreshToken);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loginUser,user, loading, error };
};

export const useFetchUserDetails = (username) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${USERS_URL}/channel/${username}`
        );
        setUser(response.data?.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};