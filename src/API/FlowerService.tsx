import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import AddFlowerPage from "../pages/addFlower/addFlowerPage";
interface FlowerRequest {
  flowerId: number;
  flowerName: string;
  flowerCount: number;
  imgUrl: string;
  flowerCost: number;
}

interface CreateFlowerProps {
  flowerName: string;
  flowerCount: number;
  photo: File; // File об'єкт для передачі файлу
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

  static async addFlower(createFlowerProps: CreateFlowerProps) {
    try {
      const formData = new FormData();
      formData.append("FlowerName", createFlowerProps.flowerName);
      formData.append("FlowerCount", createFlowerProps.flowerCount.toString());
      formData.append("Photo", createFlowerProps.photo);
      formData.append("FlowerCost", createFlowerProps.flowerCost.toString());

      return await axiosInstance.post("flower", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error adding flowers:", error);
      throw error;
    }
  }

  static async deleteFlower(flowerId: number): Promise<AxiosResponse<void>> {
    try {
      return await axiosInstance.delete<void>(`flower`, {
        params: { flowerId },
      });
    } catch (error) {
      console.error("Error deleting flower:", error);
      throw error;
    }
  }
}
