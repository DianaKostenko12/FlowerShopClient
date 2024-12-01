import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import PostService from "../../API/PostService";

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
          await PostService.getUserById();
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

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
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
  );
};

export default PersonalAccount;
