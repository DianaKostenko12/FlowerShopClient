import React from "react";
import { useAuth } from "../common/AuthContext";
import AuthorizationAccount from "../components/account/AuthorizationAccount";
import PersonalAccount from "../components/account/PersonalAccount";

const Accounts = () => {
  const { isAuthorized } = useAuth();
  return <>{isAuthorized ? <PersonalAccount /> : <AuthorizationAccount />}</>;
};

export default Accounts;
