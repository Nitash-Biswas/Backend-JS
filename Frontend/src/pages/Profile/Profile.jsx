import React, { useContext } from "react";
import UserContext from "../../contexts/userContext";

function Profile() {
  const { loggedUser } = useContext(UserContext);
  console.log(loggedUser);
  return <div>Profile</div>;
}

export default Profile;
