import axios from "axios";
import { BASE_URL, SUBSCRIPTION_URL } from "../constants";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

export const useFetchSubscibers = (username) => {
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}${SUBSCRIPTION_URL}/get_subs/${username}`
        );
        setSubscribers(response.data?.data.subscribers[0].subscribersList);
        setSubscribersCount(response.data?.data.subscribers[0].subscribersCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [username]);

  return { subscribers, subscribersCount, loading, error };
};

export const useFetchSubscribed = () => {
  const [subscribed, setSubscribed] = useState([]);
  const [subscribedCount, setSubscribedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscribed = async () => {
      try {
        //  Get Tokens from cookies
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        // Set up headers with tokens
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        };

        const response = await axios.get(
          `${BASE_URL}${SUBSCRIPTION_URL}/get_channels`,
          { headers, withCredentials: true }
        );
        setSubscribed(response.data?.data.subscribedChannels[0].subscribedList);
        setSubscribedCount(
          response.data?.data.subscribedChannels[0].subscribedCount
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribed();
  }, []);

  return { subscribed, subscribedCount, loading, error };
};
