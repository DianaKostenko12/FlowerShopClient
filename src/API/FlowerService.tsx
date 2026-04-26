import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export enum StemType {
  Soft = "Soft",
  Standard = "Standard",
  Woody = "Woody",
  Succulent = "Succulent",
}
export interface FlowerRequest {
  flowerId: number;
  flowerName: string;
  flowerCount: number;
  imgUrl: string;
  flowerCost: number;
}

export interface CreateFlowerProps {
  flowerName: string;
  flowerCount: number;
  photo: File;
  flowerCost: number;
  colorId: number;
  categoryId: number;
  headSizeCm: number;
  stemThicknessMm: number;
  stemKind: StemType;
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
      if (createFlowerProps.colorId !== undefined) {
        formData.append("ColorId", createFlowerProps.colorId.toString());
      }
      if (createFlowerProps.categoryId !== undefined) {
        formData.append("CategoryId", createFlowerProps.categoryId.toString());
      }
      formData.append("HeadSizeCm", createFlowerProps.headSizeCm.toString());
      formData.append(
        "StemThicknessMm",
        createFlowerProps.stemThicknessMm.toString()
      );
      formData.append("StemKind", createFlowerProps.stemKind);

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
