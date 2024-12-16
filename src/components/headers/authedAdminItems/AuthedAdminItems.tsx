import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "../AuthedUserItems/authedUserItems.module.css";
interface AuthedAdminItemsProps {
  logout: () => void;
}
const AuthedAdminItems = (props: AuthedAdminItemsProps) => {
  const navigate = useNavigate();

  const handleRedirectToAuthClick = () => {
    navigate("/auth-account");
  };
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link text-white fs-6" to="/orders">
          Замовлення
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white fs-6" to="/bouquets">
          Букети
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white fs-6" to="/flowers">
          Квіти
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

export default AuthedAdminItems;
