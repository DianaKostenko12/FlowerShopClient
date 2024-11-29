import React from "react";
import "./App.css";
import LoginForm from "../auth/loginForm/LoginForm";
import RegisterForm from "../RegisterForm";

function App() {
  return (
    <div className="App">
      <LoginForm />
      <RegisterForm />
    </div>
  );
}

export default App;
