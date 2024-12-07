import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../common/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthedUserItems from "./AuthedUserItems";
import UnauthorisedItems from "./UnauthorisedItems";

function Header() {
  const { isAuthorized, setIsAuthorized } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthorized(false);
  };

  const login = () => {
    navigate(`auth-account`);
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
              <UnauthorisedItems login={login} />
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
