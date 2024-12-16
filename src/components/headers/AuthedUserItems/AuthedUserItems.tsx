import { Link, useNavigate } from "react-router-dom";
import React from "react";
import classes from "./authedUserItems.module.css";
import AccountsPage from "../../../pages/auth/AccountsPage";

interface AuthedUserItemsProps {
  logout: () => void;
}

const AuthedUserItems = (props: AuthedUserItemsProps) => {
  const navigate = useNavigate();

  const handleRedirectToAuthClick = () => {
    navigate("/auth-account");
  };
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
          Особистий кабінет
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white fs-6" to="/bouquets">
          Букети
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white fs-6" to="/contact">
          Зв'язок з нами
        </Link>
      </li>
      <li className="nav-item">
        <button
          onClick={() => {
            props.logout();
            handleRedirectToAuthClick();
          }}
          className="btn btn-outline-light ms-3"
        >
          Вийти
        </button>
      </li>
    </>
  );
};

export default AuthedUserItems;
