import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BouquetsPage from "../../pages/bouquetsPage/BouquetsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../headers/Header";
import AccountsPage from "../../pages/auth/AccountsPage";
import { AuthProvider } from "../../common/AuthContext";
import BouquetIdPage from "../../pages/BouquetIdPage";
import CreateBouquetPage from "../../pages/createBouquet/createBouquetPage/CreateBouquetPage";
import { FlowerProvider } from "../../common/FlowerContext";
import AuthorizationAccount from "../../pages/auth/account/AuthorizationAccount";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <FlowerProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/bouquets" element={<BouquetsPage />} />
              <Route path="/bouquets/:id" element={<BouquetIdPage />} />
              <Route path="/create-bouquet" element={<CreateBouquetPage />} />
              <Route path="/auth-account" element={<AuthorizationAccount />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </FlowerProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
