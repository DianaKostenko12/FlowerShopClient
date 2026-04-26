import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export interface ColorResponse {
  colorId: number;
  colorName: string;
  shade: string;
}

export interface CreateColorRequest {
  colorName: string;
  shade: string;
}

export default class ColorService {
  static async getAllColors(): Promise<AxiosResponse<ColorResponse[]>> {
    try {
      return await axiosInstance.get<ColorResponse[]>("color");
    } catch (error) {
      console.error("Error finding colors:", error);
      throw error;
    }
  }

  static async addColor(
    createColorRequest: CreateColorRequest
  ): Promise<AxiosResponse<ColorResponse>> {
    try {
      return await axiosInstance.post<ColorResponse>("color", createColorRequest);
    } catch (error) {
      console.error("Error adding color:", error);
      throw error;
    }
  }
}
