import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import UserService from "../../../API/UserService";
import styles from "./PersonalAccount.module.css"; // CSS Modules

interface UserData {
  username: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  email: string;
}

const PersonalAccount: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <button className={styles.sidebarButton}>Мої замовлення</button>
          <button className={styles.sidebarButton}>Мої створені букети</button>
        </div>

        {/* Main content */}
        <div className={styles.mainContent}>
          <div className="card">
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
                <strong>Телефон:</strong> {userData.phoneNumber}
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
