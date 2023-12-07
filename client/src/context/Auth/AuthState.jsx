import axios from "axios";
import { setuid } from "process";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AUTH_API_ENDPOINTS } from "../../utils/constants";

export const AuthContext = createContext();

export function AuthState(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initTokenValidation = async (token) => {
    setLoading(true);
    await validateToken(token);
    setLoading(false);
  };

  const validateToken = async (token) => {
    try {
      // validate token on the server side
      const response = await axios.post(AUTH_API_ENDPOINTS.VALID_TOKEN, {
        token,
      });

      if (response.data.isValid) {
        console.log("validated...");
        setUser(response.data.user);
      } else {
        console.log("refreshing....");
        await refreshToken();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("token", token);
      initTokenValidation(token);
    } else {
      setLoading(false);
    }
  }, []);
  const login = async (result) => {
    localStorage.setItem("token", result.data.token);
    setUser(result.data.user);
  };
  const logout = async () => {
    try {
      await axios.delete(AUTH_API_ENDPOINTS.LOGOUT, {
        withCredentials: true,
      });
      setUser(null);
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };
  const refreshToken = async () => {
    try {
      // api call to refresh token
      axios.defaults.withCredentials = true;
      const response = await axios.post(AUTH_API_ENDPOINTS.TOKEN, {});

      if (response.data.isValid) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log("error", error);
    }
    console.log("refreshed");
  };
  return (
    <AuthContext.Provider
      value={{ login, logout, user, validateToken, loading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
