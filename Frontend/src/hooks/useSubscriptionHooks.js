import axios from "axios";
import { BASE_URL, SUBSCRIPTION_URL } from "../constants";
import Cookies from "js-cookie";
import { useState, useEffect, useCallback } from "react";


const requestHeaders = () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "x-refresh-token": refreshToken,
  };
  return headers;
};


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

export const useToggleSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


    const toggleSubscription = async (username) => {
      // console.log("toggleSubscription called");
      setLoading(true);
      try {
        const headers = requestHeaders();

        const response = await axios.post(
          `${BASE_URL}${SUBSCRIPTION_URL}/${username}`,
          {},
          { headers, withCredentials: true }
        );
        // console.log(response.data?.data);
        return response.data?.data;

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return { toggleSubscription, loading, error };
  }


export const useCheckSubscriptionStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const checkSubscription =  useCallback(async ({username}) => {
      setLoading(true);
      try {
        const headers = requestHeaders();


        const response = await axios.get(
          `${BASE_URL}${SUBSCRIPTION_URL}/check/${username}`,
          { headers, withCredentials: true }
        );

        // console.log(response.data?.data.isSubscribed);
        return response.data?.data.isSubscribed;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },[]);

    return { checkSubscription, loading, error };
  }


  export const useFetchSubsciberCount = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


      const fetchSubsCount = useCallback(async ({username}) => {
        try {
          const response = await axios.get(
            `${BASE_URL}${SUBSCRIPTION_URL}/get_subs/${username}`
          );

          // console.log({totalSubs: response.data?.data.subscribers[0].subscribersCount});
          return response.data?.data.subsCount;
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },[]);



    return { fetchSubsCount, loading, error };
  };