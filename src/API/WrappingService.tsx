import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export interface WrappingPaperInfo {
  wrappingPaperId: number;
  type: number;
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
  ) {
    try {
      return await axiosInstance.post(
        "wrapping-paper",
        createWrappingPaperRequest
      );
    } catch (error) {
      console.error("Error creating wrapping paper:", error);
      throw error;
    }
  }
}
