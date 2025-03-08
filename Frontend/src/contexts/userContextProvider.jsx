import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL, USERS_URL } from "../constants";

import UserContext from "./userContext.js";


const UserContextProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState(null);

    return (
        <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;