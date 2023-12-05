import React, { useContext } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthState";
import Loader from "../Loader/Loader";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const isProtectedRouteVisited = localStorage.getItem("protectedRouteVisited");
  // console.log(user, loading);

  if (loading) {
    return (
      <Loader
        size="30px"
        borderWidth="6px"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      />
    );
  }

  if (user) {
    localStorage.setItem("protectedRouteVisited", "true");
    return <Outlet />;
  }

  if (!isProtectedRouteVisited) {
    console.log(isProtectedRouteVisited, "autj");

    return <Navigate to="/auth" />;
  }

  if (isProtectedRouteVisited) {
    console.log(isProtectedRouteVisited, "home pagw");
    return <Navigate to="/" />;
  }

  return null; // Or handle other cases as per your requirements
};

export default ProtectedRoute;
