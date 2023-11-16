// PrivateRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ component: Component }) => {
  const { state } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        state.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
};

export default PrivateRoute;
