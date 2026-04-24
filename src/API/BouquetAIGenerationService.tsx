import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import type {
  GenerateAIBouquetRequest,
  GenerateBouquetResponse,
} from "./BouquetService";

export type { GenerateAIBouquetRequest, GenerateBouquetResponse };

export default class BouquetAIGenerationService {
  static async generateAIBouquet(
    request: GenerateAIBouquetRequest
  ): Promise<AxiosResponse<GenerateBouquetResponse>> {
    try {
      return await axiosInstance.post<GenerateBouquetResponse>(
        "AIGeneratedBouquet",
        request
      );
    } catch (error) {
      console.error("Error generating AI bouquet:", error);
      throw error;
    }
  }
}
