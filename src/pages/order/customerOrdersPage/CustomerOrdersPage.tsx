import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import { BouquetItem, OrderItemProps } from "../ordersPage/ordersPage";
import OrderService from "../../../API/OrderService";
import { formatDateTime } from "../../../helpers/orderDate-helper";
import { getStatusText } from "../../../helpers/orderStatus-helper";

const CustomerOrdersPage = () => {
  const [orderInfo, setOrderInfo] = useState<OrderItemProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const response: AxiosResponse<OrderItemProps[]> =
          await OrderService.getOrdersById();
        const orders: OrderItemProps[] = response.data;

        setOrderInfo(orders);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setError("Не вдалося завантажити дані замовлення");
      }
    };

    fetchOrderInfo();
  });

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
            <th scope="col">Замовлення</th>
            <th scope="col">Ціна</th>
            <th scope="col">Статус</th>
          </tr>
        </thead>
        <tbody>
          {orderInfo.map((order: OrderItemProps, index: number) => (
            <tr key={order.orderId}>
              <th scope="row">{order.orderId}</th>
              <td>{formatDateTime(order.orderDate)}</td>
              <td>{order.deliveryStreet}</td>
              <td>
                <div>
                  {order.bouquets.map((bouquet: BouquetItem, index: number) => (
                    <div key={index}>
                      <p>Назва букету: {bouquet.bouquetName}</p>
                      <p>К-сть: {bouquet.bouquetCount} шт.</p>
                    </div>
                  ))}
                </div>
              </td>
              <td>{order.price} грн</td>
              <td>{getStatusText(order.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerOrdersPage;
