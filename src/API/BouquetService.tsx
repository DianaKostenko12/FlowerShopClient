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
  categoriesIds?: number[];
  shapesList?: string[];
  colorsList?: string[];
}

interface CreateBouquetInfo {
  bouquetName: string;
  bouquetDescription: string;
  photo: File;
  flowers: SelectedFlower[];
  shapes: string;
  role: string;
}

interface SelectedFlower {
  flowerId: number;
  flowerCount: number;
}

export default class BouquetService {
  static async getBouquets(
    bouquetFilterInfo: BouquetFilterInfo
  ): Promise<AxiosResponse<BouquetInfo[]>> {
    try {
      const token = localStorage.getItem("jwtToken");
      const endpoint = token ? "bouquet/filter/my" : "bouquet/filter";

      return await axiosInstance.post<BouquetInfo[]>(
        endpoint,
        bouquetFilterInfo
      );
    } catch (error) {
      console.error("Error finding bouquets:", error);
      throw error;
    }
  }

  static getBouquetImageUrl(bouquetId: number): string {
    return `${axiosInstance.defaults.baseURL}/bouquet/${bouquetId}/image`;
  }

  static async createBouquet(createBouquetInfo: CreateBouquetInfo) {
    try {
      const formData = new FormData();

      formData.append("bouquetName", createBouquetInfo.bouquetName);
      formData.append(
        "bouquetDescription",
        createBouquetInfo.bouquetDescription
      );

      formData.append("photo", createBouquetInfo.photo);

      createBouquetInfo.flowers.forEach((flower, index) => {
        formData.append(
          `Flowers[${index}].FlowerId`,
          flower.flowerId.toString()
        );
        formData.append(
          `Flowers[${index}].FlowerCount`,
          flower.flowerCount.toString()
        );
      });

      createBouquetInfo.colorsList?.forEach((color, index) => {
        formData.append(`ColorsList[${index}]`, color);
      });

      createBouquetInfo.shapesList?.forEach((shape, index) => {
        formData.append(`ShapesList[${index}]`, shape);
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
