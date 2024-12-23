import React, { useState } from "react";
import UserService from "../../../API/UserService";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const handleBouquetsClick = () => {
    navigate("/bouquets");
  };
  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault(); // Запобігає перезавантаженню сторінки

    const userData = {
      firstName,
      lastName,
      username,
      email,
      phone,
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
            Реєстрація
          </h3>
          <form onSubmit={handleRegister}>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Ім'я</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Прізвище</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Ім'я користувача</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Електронна пошта</label>
              <input
                type="email"
                className="form-control form-control-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Телефон</label>
              <input
                type="tel"
                className="form-control form-control-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 d-flex flex-column align-items-start">
              <label className="form-label small">Пароль</label>
              <input
                type="password"
                className="form-control form-control-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              onChange={handleBouquetsClick}
              type="submit"
              className="btn btn-primary btn-sm w-100"
            >
              Зареєструватися
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
