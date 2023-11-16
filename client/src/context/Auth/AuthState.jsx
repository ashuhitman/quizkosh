import axios from "axios";
import { setuid } from "process";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AUTH_API_ENDPOINTS } from "../../utils/constants";

export const AuthContext = createContext();

export function AuthState(props) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [user, setUser] = useState(null);
  console.log("auth state: ", token, isValidToken, user);
  const validateToken = async () => {
    if (!token) {
      setIsValidToken(false);
      return;
    }
    try {
      // validate token on the server side
      const response = await axios.post(AUTH_API_ENDPOINTS.VALID_TOKEN, {
        token,
      });

      if (response.data.isValid) {
        setIsValidToken(true);
        setUser(response.data.user);
      } else {
        await refreshToekn();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    validateToken();
  }, []);
  const login = async (result) => {
    await localStorage.setItem("token", result.data.token);
    setToken(result.data.token);
    setUser(result.data.user);
    setIsValidToken(true);
  };
  const logout = async () => {
    try {
      await axios.delete(AUTH_API_ENDPOINTS.LOGOUT, {
        withCredentials: true,
      });
      setToken(null);
      setIsValidToken(false);
      setUser(null);
      localStorage.removeItem("token");
    } catch (error) {
      console.log("error", error);
    }
  };
  const refreshToekn = async () => {
    try {
      // api call to refresh token
      axios.defaults.withCredentials = true;
      const response = await axios.post(AUTH_API_ENDPOINTS.TOKEN, {
        // withCredentials: true,
      });

      if (response.data.isValid) {
        setToken(response.data.token);
        setIsValidToken(true);
        localStorage.setItem("token", response.data.token);

        setUser(response.data.user);
      } else {
        setToken(null);
        setUser(null);
        setIsValidToken(false);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <AuthContext.Provider value={{ login, logout, isValidToken, token, user }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
