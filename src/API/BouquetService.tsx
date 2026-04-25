import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
interface BouquetInfo {
  bouquetId: number;
  bouquetName: string;
  price: number;
  photoFileName: string;
}

export interface CheckBouquetAvailabilityRequest {
  bouquetId: number;
  bouquetCount: number;
}

export interface BouquetAvailabilityItemResponse {
  flowerId: number;
  flowerName: string;
  requiredFlowerCount: number;
  availableFlowerCount: number;
  isAvailable: boolean;
}

export interface BouquetAvailabilityResponse {
  bouquetId: number;
  bouquetCount: number;
  isAvailable: boolean;
  flowers: BouquetAvailabilityItemResponse[];
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
  color: RequestedBouquetColorDto[];
  budget: number;
  style: string;
  shape: string;
  additionalComment: string;
}

export interface RequestedBouquetColorDto {
  baseColor: string;
  shade: string;
}

export type FlowerRole = "Focal" | "Semi" | "Filler" | "Greenery";

export interface BouquetCompositionItem {
  flowerId: number;
  flowerRole: FlowerRole;
  quantity: number;
}

export interface CreateAIBouquetRequest {
  BouquetName: string;
  BouquetDescription: string;
  WrappingPaperId: number;
  Shape: string;
  PhotoBytes: string;
  PhotoContentType: string;
  Flowers: FlowerQuantityRequest[];
}

export interface FlowerQuantityRequest {
  FlowerId: number;
  FlowerCount: number;
  Role: FlowerRole;
}

export interface AIBouquetInfo {
  bouquetName: string;
  bouquetDescription: string;
  bouquetComposition: BouquetCompositionItem[];
  wrappingPaperId: number;
  shape: string;
}

export interface GenerateBouquetResponse {
  bouquetImage: string;
  bouquetInfo: AIBouquetInfo;
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

  static async checkAvailability(
    request: CheckBouquetAvailabilityRequest
  ): Promise<AxiosResponse<BouquetAvailabilityResponse>> {
    try {
      return await axiosInstance.post<BouquetAvailabilityResponse>(
        "bouquet/check-availability",
        request
      );
    } catch (error) {
      console.error("Error checking bouquet availability:", error);
      throw error;
    }
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
        formData.append(
          `Flowers[${index}].FlowerId`,
          flower.flowerId.toString()
        );
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
    request: CreateAIBouquetRequest
  ): Promise<AxiosResponse> {
    try {
      return await axiosInstance.post("bouquet/ai", request);
    } catch (error) {
      console.error("Error saving AI bouquet:", error);
      throw error;
    }
  }
}
