import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./userContext";

const PrivateRoute = ({ children }) => {
  const { loggedUser, loading } = useContext(UserContext);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  if (!isReady) {
    // Show a loading indicator while checking authentication
    return (
      <div
        className="text-4xl text-darktext bg-darkbg
      h-screen flex justify-center items-center"
      >
        Loading...
      </div>
    );
  }

  if (loggedUser) {
    // Render children if authenticated
    return children;
  }

  // Redirect to Not Found page if not authenticated
  return <Navigate to="/no-auth" />;
};

export default PrivateRoute;
