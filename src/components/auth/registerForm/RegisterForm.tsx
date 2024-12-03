import React, { useState } from "react";
import UserService from "../../../API/UserService";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault(); // Запобігає перезавантаженню сторінки

    const userData = {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
    };

    try {
      const response = await UserService.registerUser(userData);
      console.log("User registered successfully:", response.data);

      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error) {
      console.error("Failed to register user:", error);
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
            Register
          </h3>
          <form onSubmit={handleRegister}>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">First Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Last Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
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
              <label className="form-label small">Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Phone</label>
              <input
                type="tel"
                className="form-control form-control-sm"
                value={phoneNumber}
                onChange={(e) => setPhone(e.target.value)}
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
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
