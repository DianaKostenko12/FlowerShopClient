import React from "react";
import "./App.css";
import LoginForm from "../auth/loginForm/LoginForm";
import RegisterForm from "../RegisterForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <LoginForm />
      <RegisterForm />
      <ToastContainer />
    </div>
  );
}

export default App;
