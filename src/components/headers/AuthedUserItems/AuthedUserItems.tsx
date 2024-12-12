import { Link } from "react-router-dom";
import React from "react";
import classes from "./authedUserItems.module.css";
import AccountsPage from "../../../pages/auth/AccountsPage";

interface AuthedUserItemsProps {
  logout: () => void;
}

const AuthedUserItems = (props: AuthedUserItemsProps) => {
  return (
    <>
      <li className="nav-item">
        <Link to="/order-basket">
          <img
            src="/flower-basket.png"
            className={classes.flowerBasketImg}
            alt=""
          />
        </Link>
      </li>
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
