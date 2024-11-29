import React, { useState } from "react";
import PostService from "../../../API/PostService";

const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (): Promise<void> => {
    const loginData = { username, password };
    try {
      const response = await PostService.loginUser(loginData);
      const token = response.data.token;

      // Зберігаємо токен у localStorage
      localStorage.setItem("jwtToken", token);

      console.log("Login successful, token:", token);
      setErrorMessage(null);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <label style={{ marginBottom: "10px" }}>
        Username:
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            margin: "5px 0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "200px",
          }}
        />
      </label>
      <label style={{ marginBottom: "10px" }}>
        Password:
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            margin: "5px 0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "200px",
          }}
        />
      </label>
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          marginTop: "10px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Увійти
      </button>
    </div>
  );
};

export default LoginForm;
