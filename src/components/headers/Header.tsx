import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../common/AuthContext";

function Header() {
  const { isAuthorized, setIsAuthorized } = useAuth();

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthorized(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-pink">
      <div className="container-fluid">
        <Link className="navbar-brand text-white fs-3 fw-bold" to="/">
          Floral Bliss
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthorized ? (
              <AuthedUserItems logout={logout} />
            ) : (
              <UnauthorisedItems />
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

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

const UnauthorisedItems = () => {
  return (
    <>
      <button className="btn btn-outline-light ms-3">Login</button>
    </>
  );
};

export default Header;
