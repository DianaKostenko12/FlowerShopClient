import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Bouquets from "../../pages/Bouquets";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../headers/Header";
import Accounts from "../../pages/Accounts";
import { AuthProvider } from "../../common/AuthContext";
import BouquetIdPage from "../../pages/BouquetIdPage";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/bouquets" element={<Bouquets />} />
            <Route path="/bouquets/:id" element={<BouquetIdPage />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </AuthProvider>
    </div>
  );
}

export default App;
