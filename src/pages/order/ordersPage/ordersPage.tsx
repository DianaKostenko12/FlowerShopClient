import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import OrderService from "../../../API/OrderService";
import { getStatusText } from "../../../helpers/orderStatus-helper";
import { formatDateTime } from "../../../helpers/orderDate-helper";
import { useNavigate } from "react-router-dom";

export interface BouquetItem {
  bouquetName: string;
  bouquetCount: number;
}

export interface OrderItemProps {
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

const OrdersPage = () => {
  const [orderInfo, setOrderInfo] = useState<OrderItemProps[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleOrderInfoClick = (orderId: number) => {
    navigate(`/order-info/${orderId}`);
  };

  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const response: AxiosResponse<OrderItemProps[]> =
          await OrderService.getOrders();
        const orders: OrderItemProps[] = response.data;
        setOrderInfo(orders);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Не вдалося завантажити дані користувача");
      }
    };

    fetchOrderInfo();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!orderInfo || orderInfo.length === 0) {
    return (
      <div className="text-center">
        <p>Завантаження даних...</p>
      </div>
    );
  }

  return (
    <div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Номер замовлення</th>
            <th scope="col">Дата замовлення</th>
            <th scope="col">Адреса</th>
            <th scope="col">Ціна</th>
            <th scope="col">Статус</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {orderInfo.map((order: OrderItemProps, index: number) => (
            <tr key={order.orderId}>
              <th scope="row">{order.orderId}</th>
              <td>{formatDateTime(order.orderDate)}</td>
              <td>{order.deliveryStreet}</td>
              <td>{order.price} грн</td>
              <td>{getStatusText(order.status)}</td>
              <td>
                <button
                  onClick={() => handleOrderInfoClick(order.orderId)}
                  className="btn btn-primary btn-sm px-3 py-1"
                >
                  Детальніше
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
