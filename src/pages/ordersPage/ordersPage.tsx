import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import OrderService from "../../API/OrderService";

interface BouquetItem {
  bouquetName: string;
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

const OrdersPage = () => {
  const [orderInfo, setOrderInfo] = useState<OrderItemProps[] | null>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const response: AxiosResponse<OrderItemProps[]> =
          await OrderService.getOrders();
        const orders: OrderItemProps[] = response.data.map((order) => ({
          orderId: order.orderId,
          orderDate: order.orderDate,
          status: order.status,
          deliveryStreet: order.deliveryStreet,
          bouquets: order.bouquets,
          email: order.email,
          firstName: order.firstName,
          lastName: order.lastName,
          price: order.price,
        }));
        setOrderInfo(orders);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Не вдалося завантажити дані користувача");
      }
    };

    fetchOrderInfo();
  }, []);

  const getStatusText = (status: number): string => {
    switch (status) {
      case 1:
        return "В очікуванні";
      case 2:
        return "Підтверджено";
      case 3:
        return "Скасовано";
      default:
        return "Unknown";
    }
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("uk-UA");
    const formattedTime = date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} ${formattedTime}`;
  };

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
            <th scope="col">Дані покупця</th>
            <th scope="col">Email</th>
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
              <td>
                {order.firstName} {order.lastName}
              </td>
              <td>{order.email}</td>
              <td>{order.price} грн</td>
              <td>{getStatusText(order.status)}</td>
              <td>
                <button className="btn btn-primary btn-sm px-3 py-1">
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
