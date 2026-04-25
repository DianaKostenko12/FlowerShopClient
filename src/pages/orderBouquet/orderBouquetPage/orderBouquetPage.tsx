import React, { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import UserService, { GetUserData } from "../../../API/UserService";
import styles from "./orderPage.module.css";
import OrderService from "../../../API/OrderService";
import BouquetService, {
  BouquetAvailabilityResponse,
} from "../../../API/BouquetService";
import { useNavigate } from "react-router-dom";

interface OrderBouquet {
  bouquetId: number;
  bouquetName: string;
  bouquetCount: number;
  bouquetPrice: number;
}

const OrderBouquetPage = () => {
  const [userData, setUserData] = useState<GetUserData | null>(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [street, setStreet] = useState<string>("");
  const [pageError, setPageError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [availabilityMap, setAvailabilityMap] = useState<
    Record<number, BouquetAvailabilityResponse>
  >({});
  const [isCheckingAvailability, setIsCheckingAvailability] =
    useState<boolean>(false);

  const existingOrdersJson = localStorage.getItem("orderBouquets");
  const existingOrders: OrderBouquet[] = existingOrdersJson
    ? JSON.parse(existingOrdersJson)
    : [];

  const generalPrice = existingOrders.reduce(
    (total: number, order: OrderBouquet) => {
      return total + order.bouquetPrice * order.bouquetCount;
    },
    0
  );

  const checkAvailability = useCallback(async (): Promise<boolean> => {
    const ordersToCheck: OrderBouquet[] = existingOrdersJson
      ? JSON.parse(existingOrdersJson)
      : [];

    if (ordersToCheck.length === 0) {
      setAvailabilityMap({});
      return false;
    }

    setIsCheckingAvailability(true);
    setOrderError(null);

    try {
      const responses = await Promise.all(
        ordersToCheck.map(async (order) => {
          const response = await BouquetService.checkAvailability({
            bouquetId: order.bouquetId,
            bouquetCount: order.bouquetCount,
          });

          return [order.bouquetId, response.data] as const;
        })
      );

      const nextAvailabilityMap = Object.fromEntries(responses);
      setAvailabilityMap(nextAvailabilityMap);

      return responses.every(([, response]) => response.isAvailable);
    } catch (error) {
      console.error("Failed to check bouquet availability:", error);
      setOrderError(
        "Не вдалося перевірити наявність квітів. Спробуйте оновити сторінку."
      );
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [existingOrdersJson]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response: AxiosResponse<GetUserData> =
          await UserService.getUserById();
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setPageError("Не вдалося завантажити дані користувача");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    void checkAvailability();
  }, [checkAvailability]);

  if (pageError) {
    return <div className="alert alert-danger">{pageError}</div>;
  }

  if (!userData) {
    return (
      <div className="text-center">
        <p>Завантаження даних...</p>
      </div>
    );
  }

  const hasUnavailableBouquets =
    existingOrders.length === 0 ||
    existingOrders.some(
      (order) => availabilityMap[order.bouquetId] && !availabilityMap[order.bouquetId].isAvailable
    );

  const hasUncheckedBouquets = existingOrders.some(
    (order) => !availabilityMap[order.bouquetId]
  );

  const isOrderDisabled =
    isCheckingAvailability || hasUnavailableBouquets || hasUncheckedBouquets;

  const handleOrder = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    setOrderError(null);

    const isAvailable = await checkAvailability();
    if (!isAvailable) {
      setOrderError(
        "Неможливо оформити замовлення: недостатньо квітів для одного або кількох букетів."
      );
      return;
    }

    const orderToCreate = {
      deliveryStreet: street,
      bouquets: existingOrders.map((bouquet: OrderBouquet) => ({
        bouquetId: bouquet.bouquetId,
        bouquetCount: bouquet.bouquetCount,
      })),
    };

    try {
      const response = await OrderService.createOrder(orderToCreate);
      console.log("Order created successfully:", response.data);

      setStreet("");
      localStorage.removeItem("orderBouquets");
      setSuccessMessage("Замовлення успішно оформлене");

      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/bouquets");
      }, 5000);
    } catch (error) {
      console.error("Failed to make an order:", error);
      setOrderError("Не вдалося оформити замовлення. Спробуйте ще раз.");
    }
  };

  return (
    <div className={styles.container}>
      {successMessage ? (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          {successMessage}
        </div>
      ) : (
        <>
          <h1 className={styles.title}>Оформлення замовлення</h1>
          {orderError && (
            <div className={`${styles.alert} ${styles.alertError}`}>
              {orderError}
            </div>
          )}
          {hasUnavailableBouquets && !orderError && (
            <div className={`${styles.alert} ${styles.alertError}`}>
              Неможливо оформити замовлення: для частини букетів недостатньо
              квітів.
            </div>
          )}
          <div className={styles.sections}>
            <div className={styles.userInfo}>
              <h2 className={styles.subTitle}>Ваші дані</h2>
              <p>
                <strong>Телефон:</strong> {userData.phoneNumber}
              </p>
              <p>
                <strong>Ім'я та прізвище:</strong> {userData.lastName}{" "}
                {userData.firstName}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <div className={styles.inputValue}>
                <label className={styles.label}>Вулиця: </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={styles.input}
                  placeholder="Введіть вулицю"
                />
              </div>
            </div>

            <div className={styles.orderInfo}>
              <h3 className={styles.subTitle}>Ваше замовлення</h3>
              {existingOrders.map((order: OrderBouquet, index: number) => {
                const availability = availabilityMap[order.bouquetId];
                const unavailableFlowers =
                  availability?.flowers.filter((flower) => !flower.isAvailable) ??
                  [];

                return (
                  <div key={index} className={styles.orderItemWrapper}>
                    <div className={styles.orderItem}>
                      <div>{order.bouquetName}</div>
                      <div>{order.bouquetPrice} грн</div>
                      <div>{order.bouquetCount} шт.</div>
                      <div>{order.bouquetPrice * order.bouquetCount} грн</div>
                    </div>

                    {availability && !availability.isAvailable && (
                      <div className={styles.availabilityError}>
                        Недостатньо квітів для букета "{order.bouquetName}".
                        {unavailableFlowers.map((flower) => (
                          <div
                            key={`${order.bouquetId}-${flower.flowerId}`}
                            className={styles.availabilityItem}
                          >
                            {flower.flowerName}: потрібно{" "}
                            {flower.requiredFlowerCount}, доступно{" "}
                            {flower.availableFlowerCount}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className={styles.total}>
                <strong>Разом:</strong> {generalPrice} грн
              </div>
            </div>
          </div>
          <button
            className={styles.button}
            onClick={handleOrder}
            disabled={isOrderDisabled}
          >
            {isCheckingAvailability ? "Перевіряємо наявність..." : "Замовити"}
          </button>
        </>
      )}
    </div>
  );
};

export default OrderBouquetPage;
