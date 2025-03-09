import React, { useEffect, useState } from "react";
import UserContext from "./userContext.js";
import { useCheckAuth } from "../hooks/useCheckAuth.js";

const UserContextProvider = ({ children }) => {
  const { isAuthenticated, user, loading } = useCheckAuth();
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      setLoggedUser(user);
    } else {
      setLoggedUser(null);
    }
  }, [isAuthenticated, user, loading]);

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser, loading, isAuthenticated, user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;