import axios, { AxiosResponse } from "axios";

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
      return axios.post<ApiResponse>(`${base_url}/auth/register`, userData);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  static async loginUser(
    loginData: LoginData,
  ): Promise<AxiosResponse<AuthResponse>> {
    return await axios.post<AuthResponse>(`${base_url}/auth/login`, loginData);
  }
}
