import axios from "axios";
import { toast } from "react-toastify";

// Створюємо екземпляр axios з базовою конфігурацією
const axiosInstance = axios.create({
  baseURL: "https://localhost:7156", // Замініть на ваш базовий URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Перехоплювач для запитів
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Отримуємо токен з localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Додаємо Bearer токен в хедери
    }

    return config;
  },
  (error) => {
    return Promise.reject(error); // Обробка помилок запиту
  },
);

// Перехоплювач для відповідей
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Повертаємо відповідь, якщо немає помилок
  },
  (error) => {
    // Обробка помилок відповіді
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // Можна додати перенаправлення на сторінку входу
    }

    if (error.response?.status === 500) {
      toast.error(error.response?.data?.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

/*
import axiosInstance from './axiosConfig';

axiosInstance.get('/endpoint')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

 */
