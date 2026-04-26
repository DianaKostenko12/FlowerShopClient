import { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export interface CategoryInfo {
  categoryId: number;
  categoryName: string;
}

export interface CreateCategoryRequest {
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

  static async addCategory(
    createCategoryRequest: CreateCategoryRequest
  ): Promise<AxiosResponse<CategoryInfo>> {
    try {
      return await axiosInstance.post<CategoryInfo>(
        "category",
        createCategoryRequest
      );
    } catch (error) {
      console.error("Error adding category of flowers:", error);
      throw error;
    }
  }
}
