import { Link } from "react-router-dom";
import React from "react";
import AccountsPage from "../../pages/auth/AccountsPage";

interface AuthedUserItemsProps {
  logout: () => void;
}

const AuthedUserItems = (props: AuthedUserItemsProps) => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link text-white fs-6" to="/accounts">
          Personal Account
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white fs-6" to="/bouquets">
          Bouquets
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white fs-6" to="/contact">
          Contact Us
        </Link>
      </li>
      <li className="nav-item">
        <button onClick={props.logout} className="btn btn-outline-light ms-3">
          Logout
        </button>
      </li>
    </>
  );
};

export default AuthedUserItems;
