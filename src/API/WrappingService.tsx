import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export interface WrappingPaperInfo {
  wrappingPaperId: number;
  type: number;
  colorId: number;
  colorName: string;
  pattern: number;
}

export interface CreateWrappingPaperProps {
  type: number;
  colorId: number;
  pattern: number;
}

export default class WrappingService {
  static async getWrappingPapers(): Promise<
    AxiosResponse<WrappingPaperInfo[]>
  > {
    try {
      return await axiosInstance.get<WrappingPaperInfo[]>("wrapping-paper");
    } catch (error) {
      console.error("Error finding wrapping papers:", error);
      throw error;
    }
  }

  static async addWrappingPaper(
    createWrappingPaperRequest: CreateWrappingPaperProps
  ): Promise<AxiosResponse<WrappingPaperInfo>> {
    try {
      return await axiosInstance.post<WrappingPaperInfo>(
        "wrapping-paper",
        createWrappingPaperRequest
      );
    } catch (error) {
      console.error("Error creating wrapping paper:", error);
      throw error;
    }
  }

  static async deleteWrappingPaper(
    wrappingPaperId: number
  ): Promise<AxiosResponse<void>> {
    try {
      return await axiosInstance.delete<void>(
        `wrapping-paper/${wrappingPaperId}`
      );
    } catch (error) {
      console.error("Error deleting wrapping paper:", error);
      throw error;
    }
  }
}
