import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
interface FlowerRequest {
  flowerId: number;
  flowerName: string;
  flowerCount: number;
  flowerCost: number;
}
export default class FlowerService {
  static async getFlowers(): Promise<AxiosResponse<FlowerRequest[]>> {
    try {
      return await axiosInstance.get<FlowerRequest[]>("flower");
    } catch (error) {
      console.error("Error finding bouquets:", error);
      throw error;
    }
  }
}
