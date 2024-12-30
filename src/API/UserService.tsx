import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance"; // Імпортуємо конфігурований екземпляр

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface GetUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface ApiResponse {
  id: number;
  [key: string]: any;
}

export default class UserService {
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

  static async loginUser(loginData: LoginData): Promise<AxiosResponse<string>> {
    try {
      return await axiosInstance.post<string>(`auth/login`, loginData);
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  }

  static async getUserById(): Promise<AxiosResponse<GetUserData>> {
    try {
      return await axiosInstance.get<GetUserData>(`user`);
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }
}
