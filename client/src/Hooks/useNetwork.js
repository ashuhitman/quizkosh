import { useState, useEffect } from "react";
import axios from "axios";

import { AUTH_API_ENDPOINTS } from "../utils/constants";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://quizkosh.onrender.com"
    : "http://127.0.0.1:8000";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});
axiosInstance.defaults.withCredentials = true;
let isRefreshing = false;
// Interceptor for token refreshing before fetching data
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("axios interceptors running...");
    // Check if the request is for login or signup
    if (config.url === "/login" || config.url === "/signup") {
      return config; // Skip interceptors for login and signup
    }
    if (isRefreshing) return;

    // Token refresh logic before fetching data
    try {
      const response = await axios.post(AUTH_API_ENDPOINTS.TOKEN);
      const token = response.data.token;
      if (!token) throw new Error("No valid token found!");
      localStorage.setItem("token", token);
      config.headers.Authorization = "Bearer " + token;
      console.log("refreshed...");
    } catch (error) {
      console.error("useFetch: ", error);
    } finally {
      isRefreshing = false;
    }
    return config;
  },
  (error) => {
    isRefreshing = false;
    return Promise.reject(error);
  }
);

const useNetwork = () => {
  const [loading, setLoading] = useState(false);
  const handleRequest = async (url, method, data = null) => {
    setLoading(true);
    try {
      const config = {
        url,
        method: method.toLowerCase(),
        data,
      };
      const response = await axiosInstance(config);

      return response.data;
    } catch (error) {
      throw Error("Failed to fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleRequest, loading };
};

export default useNetwork;
