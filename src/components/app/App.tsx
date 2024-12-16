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
import OrderBouquetPage from "../../pages/orderBouquet/orderBouquetPage/orderBouquetPage";
import OrderBasketPage from "../../pages/orderBouquet/orderBasketPage/orderBasketPage";
import OrdersPage from "../../pages/order/ordersPage/ordersPage";
import OrderInfoPage from "../../pages/order/orderInfoPage/orderInfoPage";
import FlowerPage from "../../pages/flowerPage/flowerPage";
import AddFlowerPage from "../../pages/addFlower/addFlowerPage";
import CustomerOrdersPage from "../../pages/order/customerOrdersPage/CustomerOrdersPage";

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
              <Route path="/order-basket" element={<OrderBasketPage />} />
              <Route path="/create-order" element={<OrderBouquetPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/order-info/:id" element={<OrderInfoPage />}></Route>
              <Route path="/flowers" element={<FlowerPage />}></Route>
              <Route path="/add-flower" element={<AddFlowerPage />} />
              <Route path="/customer/orders" element={<CustomerOrdersPage />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </FlowerProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
