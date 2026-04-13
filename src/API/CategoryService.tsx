import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export interface CategoryInfo {
  categoryId: number;
  categoryName: string;
}

export default class CategoryService {
  static async getCategories(): Promise<AxiosResponse<CategoryInfo[]>> {
    try {
      return await axiosInstance.get<CategoryInfo[]>("category");
    } catch (error) {
      console.error("Error finding categories of flowers:", error);
      throw error;
    }
  }
}
