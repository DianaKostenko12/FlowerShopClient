import { Link } from "react-router-dom";
import React from "react";
import AuthedUserItems from "./AuthedUserItems";

interface UnauthorisedItemsProps {
  login: () => void;
}

const UnauthorisedItems = (props: UnauthorisedItemsProps) => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link text-white fs-6" to="/bouquets">
          Bouquets
        </Link>
      </li>
      <button onClick={props.login} className="btn btn-outline-light ms-3">
        Login
      </button>
    </>
  );
};

export default UnauthorisedItems;
