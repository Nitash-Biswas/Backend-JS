import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL, USERS_URL } from "../constants";
import UserContext from "../contexts/userContext";

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerUser = async ({
    fullname,
    email,
    username,
    password,
    avatar,
    coverImage,
  }) => {
    setLoading(true);

    // **Prepare FormData**
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("avatar", avatar); // Ensure it's a `File` object
    formData.append("coverImage", coverImage); // Ensure it's a `File` object

    // Set up headers with tokens
    const headers = {
      "Content-Type": "multipart/form-data", // Important for file uploads
    };

    try {
      await axios.post(`${BASE_URL}${USERS_URL}/register`, formData, {
        headers,
      });
      console.log("User created successfully");
    } catch (err) {
      setError(
        err.response.status === 409
          ? "User or email already exists"
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
};

export const useLoginUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError(err.status === 401 ? "Wrong Password" : "User doesn't exist");
      // console.log({ Error: err.status });
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, user, loading, error };
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
  }, [username]);

  return { user, loading, error };
};

export const useLogoutUser = () => {
  const { setLoggedUser } = useContext(UserContext);

  const logoutUser = () => {
    setLoggedUser(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    console.log("User logged out");
  };

  return logoutUser;
};
