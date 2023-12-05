import axios from "axios";
import { setuid } from "process";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AUTH_API_ENDPOINTS } from "../../utils/constants";

export const AuthContext = createContext();

export function AuthState(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const validateToken = async (token) => {
    console.log("validating...");
    setLoading(true);
    try {
      // validate token on the server side
      const response = await axios.post(AUTH_API_ENDPOINTS.VALID_TOKEN, {
        token,
      });

      if (response.data.isValid) {
        console.log("validated...");
        setUser(response.data.user);
        setLoading(false);
      } else {
        console.log("refreshing....");
        await refreshToekn();
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token);
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
  const refreshToekn = async () => {
    try {
      // api call to refresh token
      axios.defaults.withCredentials = true;
      const response = await axios.post(AUTH_API_ENDPOINTS.TOKEN, {});

      if (response.data.isValid) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setLoading(false);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
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
