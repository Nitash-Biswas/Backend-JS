import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL, USERS_URL } from "../constants";

const getAccessToken = () => Cookies.get("accessToken");
const getRefreshToken = () => Cookies.get("refreshToken");

const setTokens = (accessToken, refreshToken) => {
  Cookies.set("accessToken", accessToken);
  Cookies.set("refreshToken", refreshToken);
};

const fetchUserDetails = async (accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const response = await axios.get(`${BASE_URL}${USERS_URL}/get_user`, {
    headers,
    withCredentials: true,
  });
  return response.data?.data.user;
};

const refreshTokens = async (refreshToken) => {
  const response = await axios.post(`${BASE_URL}${USERS_URL}/refresh`, {
    refreshToken,
  });
  const { accessToken, refreshToken: newRefreshToken } = response.data.data;
  setTokens(accessToken, newRefreshToken);
  return accessToken;
};

export const useCheckAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        try {
          const user = accessToken
            ? await fetchUserDetails(accessToken)
            : await fetchUserDetails(await refreshTokens(refreshToken));
          setIsAuthenticated(true);
          setUser(user);
        } catch (err) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            try {
              const newAccessToken = await refreshTokens(refreshToken);
              const user = await fetchUserDetails(newAccessToken);
              setIsAuthenticated(true);
              setUser(user);
            } catch (refreshErr) {
              setIsAuthenticated(false);
              setUser(null);
              setError(refreshErr.response?.data?.message || "An error occurred");
            }
          } else {
            throw err;
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, user, loading, error };
};