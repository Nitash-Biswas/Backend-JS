import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./userContext";

const PrivateRoute = ({ children }) => {
  const { loggedUser } = useContext(UserContext);

  if (!loggedUser) {
    // Redirect to Not Found page if not authenticated
    return <Navigate to="/no-auth" />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;