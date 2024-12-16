import React, { useEffect, useState } from "react";
import FlowerService from "../../API/FlowerService";
import styles from "./flowerPage.module.css";
import { useNavigate } from "react-router-dom";

interface FlowerRequest {
  flowerId: number;
  flowerName: string;
  flowerCount: number;
  flowerCost: number;
}

const FlowerPage = () => {
  const [flowers, setFlowers] = useState<FlowerRequest[]>([]);
  const navigate = useNavigate();

  const handleAddFlowerClick = () => {
    navigate("/add-flower");
  };

  useEffect(() => {
    const initialFlowers = async () => {
      try {
        const response = await FlowerService.getFlowers();
        const flowers: FlowerRequest[] = response.data;
        setFlowers(flowers);
      } catch (error) {
        console.error("Error fetching flowers:", error);
      }
    };
    initialFlowers();
  }, []);

  return (
    <div className={styles.container}>
      <button className={styles.addButton} onClick={handleAddFlowerClick}>
        Додати квітку
      </button>
      {flowers.map((flower: FlowerRequest) => (
        <div key={flower.flowerId} className={styles.flowerCard}>
          <p className={styles.flowerName}>{flower.flowerName}</p>
          <p className={styles.flowerPrice}>Ціна: {flower.flowerCost} грн</p>
          <p>К-сть: {flower.flowerCount} шт</p>
        </div>
      ))}
    </div>
  );
};

export default FlowerPage;
