import React from "react";
import { useAuth } from "../common/AuthContext";
import AuthorizationAccount from "../components/headers/AuthorizationAccount";
import PersonalAccount from "../components/headers/PersonalAccount";

const Accounts = () => {
  const { isAuthorized } = useAuth();
  return <>{isAuthorized ? <PersonalAccount /> : <AuthorizationAccount />}</>;
};

export default Accounts;
