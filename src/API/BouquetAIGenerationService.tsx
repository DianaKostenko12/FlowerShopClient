import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

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

export default class BouquetAIGenerationService {
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
}
