import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance"; // Імпортуємо конфігурований екземпляр

const base_url = "https://localhost:7156";

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface ApiResponse {
  id: number;
  [key: string]: any;
}

interface AuthResponse {
  token: string; // JWT токен
}

export default class PostService {
  static async registerUser(
    userData: UserData,
  ): Promise<AxiosResponse<ApiResponse>> {
    try {
      return axiosInstance.post<ApiResponse>(`auth/register`, userData);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  static async loginUser(
    loginData: LoginData,
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      return await axiosInstance.post<AuthResponse>(`$auth/login`, loginData);
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }
}
