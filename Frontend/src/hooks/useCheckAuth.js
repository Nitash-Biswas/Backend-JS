import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL, USERS_URL } from "../constants";

export const useCheckAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        //Step 1:

        // hook first checks if both the access token and refresh token are present.
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        //If either is missing,
        if (!accessToken || !refreshToken) {
          setIsAuthenticated(false);
          return;
        }

        //It attempts to fetch logged user details using the access token and refresh token
        try {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          };

          const response = await axios.get(`${BASE_URL}${USERS_URL}/get_user`, {
            headers,
            withCredentials: true,
          });

          setIsAuthenticated(true);

          //Sets logged user details in the context
          setUser(response.data?.data.user);
        } catch (err) {
          //Step 2:

          //If access token is expired, it gives UNAUTHORISED ERROR (401 ERROR)
          if (err.response?.status === 401) {

            try {

              //try to refresh tokens if valid refresh token is still present
              const refreshResponse = await axios.post(
                `${BASE_URL}${USERS_URL}/refresh`,
                {
                  refreshToken,
                }
              );

              // Update tokens in cookies
              Cookies.set("accessToken", refreshResponse.data.data.accessToken);
              Cookies.set(
                "refreshToken",
                refreshResponse.data.data.refreshToken
              );

              // Retry fetching user details with new access and refresh tokens
              const headers = {
                Authorization: `Bearer ${refreshResponse.data.data.accessToken}`,
                "x-refresh-token": refreshResponse.data.data.refreshToken,
              };

              const response = await axios.get(
                `${BASE_URL}${USERS_URL}/get_user`,
                {
                  headers,
                  withCredentials: true,
                }
              );

              setIsAuthenticated(true);

              //Sets logged user details in the context
              setUser(response.data?.data.user);


            } catch (refreshErr) {
              // Refresh token is also expired or invalid
              setIsAuthenticated(false);
              setUser(null);
              setError(
                refreshErr.response?.data?.message || "An error occurred"
              );
            }
          } else {
            throw err;
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, user, error };
};
