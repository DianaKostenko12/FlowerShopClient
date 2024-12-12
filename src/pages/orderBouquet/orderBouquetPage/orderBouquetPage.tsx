import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import UserService from "../../../API/UserService";
import styles from "./orderPage.module.css";
import BouquetService from "../../../API/BouquetService";
import OrderService from "../../../API/OrderService";
import { useNavigate } from "react-router-dom";
interface UserData {
  username: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  email: string;
}

interface OrderBouquet {
  bouquetId: number;
  bouquetName: string;
  bouquetCount: number;
  bouquetPrice: number;
}
const OrderBouquetPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [street, setStreet] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const existingOrdersJson = localStorage.getItem("orderBouquets");
  const existingOrders = existingOrdersJson
    ? JSON.parse(existingOrdersJson)
    : [];

  const generalPrice = existingOrders.reduce(
    (total: number, order: OrderBouquet) => {
      return total + order.bouquetPrice * order.bouquetCount;
    },
    0,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response: AxiosResponse<UserData> =
          await UserService.getUserById();
        console.log(response);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Не вдалося завантажити дані користувача");
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!userData) {
    return (
      <div className="text-center">
        <p>Завантаження даних...</p>
      </div>
    );
  }

  const handleOrder = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const orderToCreate = {
      deliveryStreet: street,
      bouquets: existingOrders.map((bouquet: OrderBouquet) => ({
        bouquetId: bouquet.bouquetId,
        bouquetCount: bouquet.bouquetCount,
      })),
    };

    console.log(orderToCreate);
    try {
      /*const response = await OrderService.createOrder(orderToCreate);
      console.log("Order created successfully:", response.data);*/

      setStreet("");
      localStorage.removeItem("orderBouquets");
      // Встановлення повідомлення про успіх
      setSuccessMessage("Замовлення успішно оформлене");

      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/bouquets");
      }, 5000);
    } catch (error) {
      console.error("Failed to make an order:", error);
    }
  };

  return (
    <div className={styles.container}>
      {successMessage ? (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          {successMessage}
        </div>
      ) : (
        <>
          <h1 className={styles.title}>Оформлення замовлення</h1>
          <div className={styles.sections}>
            {/* Блок з даними користувача */}
            <div className={styles.userInfo}>
              <h2 className={styles.subTitle}>Ваші дані</h2>
              <p>
                <strong>Телефон:</strong> {userData.phoneNumber}
              </p>
              <p>
                <strong>Ім'я та прізвище:</strong> {userData.lastName}{" "}
                {userData.firstName}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <div className={styles.inputValue}>
                <label className={styles.label}>Вулиця: </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={styles.input}
                  placeholder="Введіть вулицю"
                />
              </div>
            </div>

            {/* Блок з інформацією про замовлення */}
            <div className={styles.orderInfo}>
              <h3 className={styles.subTitle}>Ваше замовлення</h3>
              {existingOrders.map((order: OrderBouquet, index: number) => (
                <div key={index} className={styles.orderItem}>
                  <div>{order.bouquetName}</div>
                  <div>{order.bouquetPrice} грн</div>
                  <div>{order.bouquetCount} шт.</div>
                  <div>{order.bouquetPrice * order.bouquetCount} грн</div>
                </div>
              ))}
              <div className={styles.total}>
                <strong>Разом:</strong> {generalPrice} грн
              </div>
            </div>
          </div>
          <button className={styles.button} onClick={handleOrder}>
            Замовити
          </button>
        </>
      )}
    </div>
  );
};

export default OrderBouquetPage;
