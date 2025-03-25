import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL, USERS_URL } from "../constants";
import UserContext from "../contexts/userContext";

const requestHeaders = ({ hasImage = false }) => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "x-refresh-token": refreshToken,
    "Content-Type": hasImage ? "multipart/form-data" : "application/json",
  };
  return headers;
};

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
      //console.log("User created successfully");
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

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // console.log("Update Password Hook");
  const updatePassword = async ({ oldPassword, newPassword }) => {
    setLoading(true);
    try {
      const headers = requestHeaders({ hasImage: false });
      const response = await axios.post(
        `${BASE_URL}${USERS_URL}/change_password`,
        { oldPassword: oldPassword, newPassword: newPassword },
        { headers, withCredentials: true }
      );
      // console.log("Password updated successfully");
      // console.log(response);
      return response.data;
    } catch (err) {
      setError(err.status === 401 ? "Wrong Password" : err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updatePassword, loading, error };
};

export const useUpdateImages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateAvatar = async ({ avatar }) => {
    setLoading(true);

    //Prepare Form Data
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const headers = requestHeaders({ hasImage: true });
      const response = await axios.patch(
        `${BASE_URL}${USERS_URL}/update_avatar`,
        formData,
        { headers, withCredentials: true }
      );
      // console.log("Avatar updated successfully");
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCoverImage = async ({ coverImage }) => {
    setLoading(true);

    //Prepare Form Data
    // console.log(coverImage);
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    // console.log(formData.get("coverImage"));

    try {
      const headers = requestHeaders({ hasImage: true });
      const response = await axios.patch(
        `${BASE_URL}${USERS_URL}/update_cover_image`,
        formData,
        { headers, withCredentials: true }
      );
      // console.log("Cover image updated successfully");
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateAvatar, updateCoverImage, loading, error };
};

export const useGetWatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWatchHistory = async () => {
    setLoading(true);
    try {
      const headers = requestHeaders({ hasImage: false });
      const response = await axios.get(
        `${BASE_URL}${USERS_URL}/watch_history`,
        { headers, withCredentials: true }
      );
      // console.log("Watch history fetched successfully");
      setWatchHistory(response.data?.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  //console.log(watchHistory);
  useEffect(() => {
    getWatchHistory();
  }, []);

  return { watchHistory, loading, error, refresh: getWatchHistory };
};

export const useEditWatchHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addToWatchHistory = async ({ videoId }) => {
    setLoading(true);
    try {
      const headers = requestHeaders({ hasImage: false });
      const response = await axios.post(
        `${BASE_URL}${USERS_URL}/add_to_history`,
        { videoId: videoId },
        { headers, withCredentials: true }
      );
      // console.log("Video added to watch history successfully");
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchHistory = async ({ videoId }) => {
    setLoading(true);
    try {
      const headers = requestHeaders({ hasImage: false });
      const response = await axios.post(
        `${BASE_URL}${USERS_URL}/remove_from_history`,
        { videoId: videoId },
        { headers, withCredentials: true }
      );
      // console.log("Video removed from watch history successfully");
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearWatchHistory = async () => {
    setLoading(true);
    try {
      const headers = requestHeaders({ hasImage: false });
      const response = await axios.post(
        `${BASE_URL}${USERS_URL}/clear_history`,
        {},
        { headers, withCredentials: true }
      );
      // console.log("Watch history cleared successfully");
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    clearWatchHistory,
    addToWatchHistory,
    removeFromWatchHistory,
    loading,
    error,
  };
};

export const useLogoutUser = () => {
  const { setLoggedUser } = useContext(UserContext);

  const logoutUser = () => {
    setLoggedUser(null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    // console.log("User logged out");
  };

  return logoutUser;
};

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteUser = async () => {
    setLoading(true);
    try {
      const headers = requestHeaders({ formData: false });
      const response = await axios.delete(
        `${BASE_URL}${USERS_URL}/delete_user`,
        { headers, withCredentials: true }
      );
      // console.log("User deleted successfully");
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};
