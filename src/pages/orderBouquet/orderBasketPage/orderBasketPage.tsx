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
  const isCreateOrderDisabled = orders.length === 0;
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

  const updateBouquetCount = (id: number, count: number) => {
    const normalizedCount = Math.max(1, count);
    const updatedOrders = orders.map((order) =>
      order.bouquetId === id
        ? { ...order, bouquetCount: normalizedCount }
        : order
    );

    setOrders(updatedOrders);
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
          orders.map((order) => (
            <div key={order.bouquetId} className={styles.basketItem}>
              <div className={styles.valueItem}>
                <strong>Найменування:</strong> {order.bouquetName}
              </div>
              <div className={styles.valueItem}>
                <strong>Вартість:</strong> {order.bouquetPrice} грн
              </div>
              <div className={styles.valueItem}>
                <strong>Кількість:</strong>
                <div className={styles.quantityControl}>
                  <button
                    type="button"
                    className={styles.quantityButton}
                    onClick={() =>
                      updateBouquetCount(
                        order.bouquetId,
                        order.bouquetCount - 1
                      )
                    }
                    disabled={order.bouquetCount <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    className={styles.quantityInput}
                    value={order.bouquetCount}
                    onChange={(event) =>
                      updateBouquetCount(
                        order.bouquetId,
                        Number(event.target.value)
                      )
                    }
                  />
                  <button
                    type="button"
                    className={styles.quantityButton}
                    onClick={() =>
                      updateBouquetCount(
                        order.bouquetId,
                        order.bouquetCount + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
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
      <button
        onClick={handleCreateOrderClick}
        className={styles.actionButton}
        disabled={isCreateOrderDisabled}
      >
        Оформити замовлення
      </button>
    </div>
  );
};

export default OrderBasketPage;
