import React, { useEffect } from "react";
import styles from "./orderBasketPage.module.css";
import { useNavigate } from "react-router-dom";

interface OrderBouquet {
  bouquetId: number;
  bouquetName: string;
  bouquetCount: number;
  bouquetPrice: number;
}
const OrderBasketPage = () => {
  const [orders, setOrders] = React.useState<OrderBouquet[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const existingOrdersJson = localStorage.getItem("orderBouquets");
    const existingOrders = existingOrdersJson
      ? JSON.parse(existingOrdersJson)
      : [];
    setOrders(existingOrders);
  }, []);

  const handleCreateOrderClick = () => {
    navigate("/create-order");
  };

  // Функція для видалення букета за його ID
  const removeBouquet = (id: number) => {
    // Фільтруємо масив замовлень, щоб виключити букет з певним ID
    const updatedOrders = orders.filter((order) => order.bouquetId !== id);

    // Оновлюємо стан замовлень
    setOrders(updatedOrders);

    // Оновлюємо дані в localStorage
    localStorage.setItem("orderBouquets", JSON.stringify(updatedOrders));
  };

  const generalPrice = orders.reduce((total: number, order: OrderBouquet) => {
    return total + order.bouquetPrice * order.bouquetCount;
  }, 0);

  return (
    <div className={styles.basketContainer}>
      <h2 className={styles.basketTitle}>Ваш кошик</h2>
      <div>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className={styles.basketItem}>
              <div className={styles.valueItem}>
                <strong>Найменування:</strong> {order.bouquetName}
              </div>
              <div className={styles.valueItem}>
                <strong>Вартість:</strong> {order.bouquetPrice} грн
              </div>
              <div className={styles.valueItem}>
                <strong>Кількість:</strong> {order.bouquetCount}
              </div>
              <div className={styles.valueItem}>
                <strong>Сума:</strong> {order.bouquetPrice * order.bouquetCount}{" "}
                грн
              </div>
              <button
                className={styles.removeButton}
                onClick={() => removeBouquet(order.bouquetId)}
              >
                Видалити
              </button>
            </div>
          ))
        ) : (
          <p className={styles.noOrders}>Кошик порожній</p>
        )}
        <div className={styles.basketTotal}>
          <strong>Разом:</strong> {generalPrice} грн
        </div>
      </div>
      <button onClick={handleCreateOrderClick} className={styles.removeButton}>
        Оформити замовлення
      </button>
    </div>
  );
};

export default OrderBasketPage;
