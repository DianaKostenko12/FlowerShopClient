import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import AddFlowerPage from "../pages/addFlower/addFlowerPage";
interface FlowerRequest {
  flowerId: number;
  flowerName: string;
  flowerCount: number;
  flowerCost: number;
}

interface AddFlowerProps {
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

  static async addFlower(addFlowerProps: AddFlowerProps) {
    try {
      return await axiosInstance.post("flower", addFlowerProps);
    } catch (error) {
      console.error("Error adding flowers:", error);
      throw error;
    }
  }
}
