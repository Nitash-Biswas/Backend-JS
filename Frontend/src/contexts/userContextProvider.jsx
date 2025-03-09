import {  useState, useEffect } from "react";
import { useCheckAuth } from "../hooks/useCheckAuth.js";
import UserContext from "./userContext.js";


const UserContextProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState(null);
    const {isAuthenticated, user, error} = useCheckAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            setLoggedUser(user);
        }
        else{
            setLoggedUser(null);
        }
    }, [isAuthenticated, user]);

    return (
        <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;