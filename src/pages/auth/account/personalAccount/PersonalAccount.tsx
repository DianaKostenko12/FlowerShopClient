import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import UserService from "../../../../API/UserService";
import styles from "./personalAccount.module.css";
import { useNavigate } from "react-router-dom"; // CSS Modules

interface UserData {
  username: string;
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
}

const PersonalAccount: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCustomerOrdersClick = () => {
    navigate("/customer/orders");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response: AxiosResponse<UserData> =
          await UserService.getUserById();
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Не вдалося завантажити дані користувача");
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div className={styles.alertDanger}>{error}</div>;
  }

  if (!userData) {
    return (
      <div className={styles.loadingContainer}>
        <p>Завантаження даних...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <button
            onClick={handleCustomerOrdersClick}
            className={styles.sidebarButton}
          >
            Мої замовлення
          </button>
        </div>
        <div className={styles.mainContent}>
          <div className={`card ${styles.cardCustom}`}>
            <div className={`card-header ${styles.cardHeader}`}>
              <h2>Особисті дані</h2>
            </div>
            <div className="card-body">
              <p>
                <strong>Username:</strong> {userData.username}
              </p>
              <p>
                <strong>Прізвище:</strong> {userData.lastName}
              </p>
              <p>
                <strong>Ім'я:</strong> {userData.firstName}
              </p>
              <p>
                <strong>Телефон:</strong> {userData.phone}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAccount;
