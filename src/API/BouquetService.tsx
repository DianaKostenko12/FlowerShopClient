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
}
