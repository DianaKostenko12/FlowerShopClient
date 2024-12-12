import { Bouquet } from "../pages/createBouquet/bouquet/bouquetItem/BouquetItem";
import axiosInstance from "./axiosInstance";

interface OrderBouquetInfo {
  deliveryStreet: string;
  bouquets: SelectedBouquet[];
}

interface SelectedBouquet {
  bouquetId: number;
  bouquetCount: number;
}
export default class OrderService {
  static async createOrder(orderBouquetInfo: OrderBouquetInfo) {
    try {
      return await axiosInstance.post("order", orderBouquetInfo);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
}
