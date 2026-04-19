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
  wrappingPaperId: number;
  shape: string;
  photo: File;
  flowers: SelectedFlower[];
}

interface SelectedFlower {
  flowerId: number;
  flowerCount: number;
  role: string;
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

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        if (typeof result !== "string") {
          reject(new Error("Failed to read photo file."));
          return;
        }

        resolve(result.split(",")[1] ?? "");
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  static async createBouquet(createBouquetInfo: CreateBouquetInfo) {
    try {
      const photoBytes = await this.fileToBase64(createBouquetInfo.photo);

      return await axiosInstance.post("bouquet", {
        bouquetName: createBouquetInfo.bouquetName,
        bouquetDescription: createBouquetInfo.bouquetDescription,
        wrappingPaperId: createBouquetInfo.wrappingPaperId ?? 0,
        shape: createBouquetInfo.shape,
        photoBytes,
        photoContentType: createBouquetInfo.photo.type,
        flowers: createBouquetInfo.flowers.map((flower) => ({
          flowerId: flower.flowerId,
          flowerCount: flower.flowerCount,
          role: flower.role ?? 0,
        })),
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
