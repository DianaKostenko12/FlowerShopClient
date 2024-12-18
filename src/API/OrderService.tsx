import { Bouquet } from "../pages/createBouquet/bouquet/bouquetItem/BouquetItem";
import axiosInstance from "./axiosInstance";
import { AxiosResponse } from "axios";

interface OrderBouquetInfo {
  deliveryStreet: string;
  bouquets: SelectedBouquet[];
}

interface SelectedBouquet {
  bouquetId: number;
  bouquetCount: number;
}

interface OrderItemProps {
  orderId: number;
  orderDate: string;
  status: number;
  deliveryStreet: string;
  bouquets: BouquetItem[];
  email: string;
  firstName: string;
  lastName: string;
  price: number;
}

interface BouquetItem {
  bouquetName: string;
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

  static async getOrders(): Promise<AxiosResponse<OrderItemProps[]>> {
    try {
      return await axiosInstance.get<OrderItemProps[]>("order");
    } catch (error) {
      console.error("Error finding orders:", error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId: number, status: number) {
    try {
      return await axiosInstance.put(`order/${orderId}/status/${status}`);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  static async getOrdersById(): Promise<AxiosResponse<OrderItemProps[]>> {
    try {
      return await axiosInstance.get<OrderItemProps[]>("order/user/userId");
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }
}
