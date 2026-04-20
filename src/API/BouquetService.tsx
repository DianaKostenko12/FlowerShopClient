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

export interface GenerateAIBouquetRequest {
  color: string[];
  budget: number;
  style: string;
  shape: string;
  additionalComment: string;
}

export interface FlowerCompositionItem {
  flower: {
    flowerId: number;
    flowerName: string;
    imgUrl: string;
  };
  role: string;
  quantity: number;
  unitPrice: number;
}

export interface AIWrappingPaper {
  wrappingPaperId: number;
  type: number;
  colorId: number;
  colorName: string;
  pattern: number;
}

export interface BouquetDetails {
  bouquetName: string;
  flowerComposition: FlowerCompositionItem[];
  wrappingPaper: AIWrappingPaper;
  shape: string;
}

export interface GenerateBouquetResponse {
  bouquetImage: string;
  bouquetDetails: BouquetDetails;
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

      formData.append("BouquetName", createBouquetInfo.bouquetName);
      formData.append(
        "BouquetDescription",
        createBouquetInfo.bouquetDescription
      );
      formData.append(
        "WrappingPaperId",
        createBouquetInfo.wrappingPaperId.toString()
      );
      formData.append("Shape", createBouquetInfo.shape);
      formData.append("Photo", createBouquetInfo.photo);

      createBouquetInfo.flowers.forEach((flower, index) => {
        formData.append(`Flowers[${index}].FlowerId`, flower.flowerId.toString());
        formData.append(
          `Flowers[${index}].FlowerCount`,
          flower.flowerCount.toString()
        );
        formData.append(`Flowers[${index}].Role`, flower.role);
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

  static async generateAIBouquet(
    request: GenerateAIBouquetRequest
  ): Promise<AxiosResponse<GenerateBouquetResponse>> {
    try {
      return await axiosInstance.post<GenerateBouquetResponse>(
        "bouquet/ai/generate",
        request
      );
    } catch (error) {
      console.error("Error generating AI bouquet:", error);
      throw error;
    }
  }

  static async saveAIBouquet(
    bouquetDetails: BouquetDetails
  ): Promise<AxiosResponse> {
    try {
      return await axiosInstance.post("bouquet/ai", bouquetDetails);
    } catch (error) {
      console.error("Error saving AI bouquet:", error);
      throw error;
    }
  }
}
