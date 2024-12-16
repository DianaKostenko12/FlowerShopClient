import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import OrderService from "../../../API/OrderService";
import { BouquetItem, OrderItemProps } from "../ordersPage/ordersPage";
import { useParams } from "react-router-dom";
import { getStatusText } from "../../../helpers/orderStatus-helper";
import { formatDateTime } from "../../../helpers/orderDate-helper";
import styles from "./orderInfoPage.module.css";

const OrderInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [orderInfo, setOrderInfo] = useState<OrderItemProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<number>(1); // Встановлюємо початковий статус

  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const response: AxiosResponse<OrderItemProps[]> =
          await OrderService.getOrders();
        const orders: OrderItemProps[] = response.data;
        const order = orders.find((o) => o.orderId === Number(id));

        if (!order) {
          setError("Замовлення з таким ID не знайдено");
          return;
        }
        setOrderInfo(order);
        setNewStatus(order.status); // Встановлюємо поточний статус
      } catch (error) {
        console.error("Error fetching order data:", error);
        setError("Не вдалося завантажити дані замовлення");
      }
    };

    fetchOrderInfo();
  }, [id]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = Number(event.target.value);
    setNewStatus(status);
  };

  const handleUpdateStatus = async () => {
    try {
      if (orderInfo) {
        await OrderService.updateOrderStatus(orderInfo.orderId, newStatus);
        setOrderInfo((prev) => (prev ? { ...prev, status: newStatus } : null)); // Оновлюємо статус на клієнті
        setError(null);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Не вдалося оновити статус замовлення");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderInfo) {
    return <div>Завантаження даних замовлення...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Замовлення №{orderInfo.orderId}</h1>
      <h3 className={styles["section-title"]}>Дані користувача</h3>
      <div className={styles["user-details"]}>
        <p>
          Прізвище та ім'я покупця: {orderInfo.lastName} {orderInfo.firstName}
        </p>
        <p>Email: {orderInfo.email}</p>
        <p>Адреса: {orderInfo.deliveryStreet}</p>
      </div>
      <h3 className={styles["section-title"]}>Деталі замовлення</h3>
      <div className={styles["order-details"]}>
        {orderInfo.bouquets.map((bouquet: BouquetItem, index: number) => (
          <div key={index}>
            <p>Назва букету: {bouquet.bouquetName}</p>
            <p>К-сть: {bouquet.bouquetCount} шт.</p>
          </div>
        ))}
      </div>
      <p>Дата замовлення: {formatDateTime(orderInfo.orderDate)}</p>
      <p>Ціна: {orderInfo.price}</p>
      <p>Статус: {getStatusText(orderInfo.status)}</p>

      <div className={styles["status-update"]}>
        <h3>Зміна статусу замовлення</h3>
        <select value={newStatus} onChange={handleStatusChange}>
          <option value={1}>В очікуванні</option>
          <option value={2}>Підтверджено</option>
          <option value={3}>Скасовано</option>
        </select>
        <button onClick={handleUpdateStatus}>Оновити статус</button>
      </div>
      {error && <div className={styles["error-message"]}>{error}</div>}
      {!orderInfo && (
        <div className={styles["loading-message"]}>
          Завантаження даних замовлення...
        </div>
      )}
    </div>
  );
};

export default OrderInfoPage;
