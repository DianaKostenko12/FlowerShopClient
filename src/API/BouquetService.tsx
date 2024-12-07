import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

interface BouquetInfo {
  bouquetId: number;
  bouquetName: string;
  price: number;
}

interface BouquetFilterInfo {
  minPrice?: number;
  maxPrice?: number;
  flowerIds?: number[];
}

interface CreateBouquetInfo {
  bouquetName: string;
  bouquetDescription: string;
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
      return await axiosInstance.post("bouquet", createBouquetInfo);
    } catch (error) {
      console.error("Error finding bouquets:", error);
      throw error;
    }
  }
}
