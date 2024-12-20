import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

interface BouquetInfo {
  bouquetId: number;
  bouquetName: string;
  price: number;
  photoFileName: string;
}

interface BouquetFilterInfo {
  minPrice?: number;
  maxPrice?: number;
  flowerIds?: number[];
}

interface CreateBouquetInfo {
  bouquetName: string;
  bouquetDescription: string;
  photo: File;
  flowers: SelectedFlower[];
}

interface SelectedFlower {
  flowerId: number;
  flowerCount: number;
}

export default class BouquetService {
  static async getBouquets(
    bouquetFilterInfo: BouquetFilterInfo,
  ): Promise<AxiosResponse<BouquetInfo[]>> {
    try {
      return await axiosInstance.post<BouquetInfo[]>(
        "bouquet/filter",
        bouquetFilterInfo,
      );
    } catch (error) {
      console.error("Error finding bouquets:", error);
      throw error;
    }
  }

  static async createBouquet(createBouquetInfo: CreateBouquetInfo) {
    try {
      const formData = new FormData();

      formData.append("bouquetName", createBouquetInfo.bouquetName);
      formData.append(
        "bouquetDescription",
        createBouquetInfo.bouquetDescription,
      );

      formData.append("photo", createBouquetInfo.photo);

      createBouquetInfo.flowers.forEach((flower, index) => {
        formData.append(
          `Flowers[${index}].FlowerId`,
          flower.flowerId.toString(),
        );
        formData.append(
          `Flowers[${index}].FlowerCount`,
          flower.flowerCount.toString(),
        );
      });

      return await axiosInstance.post("bouquet", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error creating bouquet:", error);
      throw error;
    }
  }

  static async deleteBouquet(bouquetId: number): Promise<AxiosResponse<void>> {
    try {
      return await axiosInstance.delete<void>(`bouquet`, {
        params: { bouquetId },
      });
    } catch (error) {
      console.error("Error deleting bouquet:", error);
      throw error;
    }
  }
}
