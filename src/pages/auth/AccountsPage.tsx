import React from "react";
import { useAuth } from "../../common/AuthContext";
import AuthorizationAccount from "./account/AuthorizationAccount";
import PersonalAccount from "./account/personalAccount/PersonalAccount";

const AccountsPage = () => {
  const { isAuthorized } = useAuth();
  return <>{isAuthorized ? <PersonalAccount /> : <AuthorizationAccount />}</>;
};

export default AccountsPage;
