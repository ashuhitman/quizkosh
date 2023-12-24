import axios from "axios";
import { useAuth } from "../context/Auth/AuthState";
const refreshToken = () => {};
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://quizkosh.onrender.com"
    : "http://127.0.0.1:8000";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});
// Interceptor to refresh token before making a request
axiosInstance.interceptors.request.use(
  async (config) => {
    // Check if the request is for login or signup
    if (config.url === "/login" || config.url === "/signup") {
      return config; // Skip interceptors for login and signup
    }

    // Get the token from wherever it's stored (localStorage, cookies, etc.)
    const token = localStorage.getItem("token");
    // Refresh the token
    if (token) {
      await refreshToken();
    }

    // Use the existing token
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const handleRequest = async (url, method, data = null) => {
  const config = {
    method: method.toLowerCase(),
    url: url,
    data: data,
  };

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    throw new Error("Request failed: " + error.message);
  }
};
