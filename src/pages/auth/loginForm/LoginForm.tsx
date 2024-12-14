import React, { useState } from "react";
import UserService from "../../../API/UserService";
import { useAuth } from "../../../common/AuthContext";

const LoginForm: React.FC = () => {
  const { isAuthorized, setIsAuthorized, setUserRole } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const loginData = { username, password };
    try {
      const response = await UserService.loginUser(loginData);

      if (response.data) {
        localStorage.setItem("jwtToken", response.data);
        setIsAuthorized(true);
        const token = localStorage.getItem("jwtToken");
        if (token) {
          const parsedToken = JSON.parse(atob(token.split(".")[1]));
          const role =
            parsedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          if (!!role) {
            console.log("role in if", role);
            setUserRole(role);
          }
        } else {
          setIsAuthorized(false);
          setUserRole(null);
        }
      }
      setErrorMessage(null);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "350px" }}>
        <div className="card-body">
          <h3
            className="card-title text-center mb-4"
            style={{ fontSize: "1.5rem" }}
          >
            Login
          </h3>

          {errorMessage && (
            <div className="alert alert-danger text-center" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Username</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
