import React, { useState, useEffect } from "react";
import FlowerItem from "./FlowerItem";
import FlowerService from "../../API/FlowerService";
import CreateBouquet from "../../pages/CreateBouquet";

export interface Flower {
  flowerId: number;
  flowerName: string;
  flowerCount: number;
  quantity: number;
  flowerCost: number;
}

const FlowerList: React.FC = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    // Імітація GET-запиту для отримання квітів
    const fetchFlowers = async () => {
      const response = await FlowerService.getFlowers();

      const initialFlowers = response.data.map((flower) => ({
        ...flower,
        quantity: 0,
      }));
      setFlowers(initialFlowers);
    };
    fetchFlowers();
  }, []);

  const handleQuantityChange = (flowerId: number, newQuantity: number) => {
    setFlowers((prevFlowers) =>
      prevFlowers.map((flower) =>
        flower.flowerId === flowerId
          ? { ...flower, quantity: newQuantity }
          : flower,
      ),
    );
    console.log(`Flower ID: ${flowerId}, Ordered Quantity: ${newQuantity}`);
  };

  const selectedFlowers = flowers
    .filter((flower) => flower.quantity > 0) // Тільки ті, що мають замовлення
    .map((flower) => ({
      flowerId: flower.flowerId,
      quantity: flower.quantity,
    }));

  return (
    <div>
      <h1>Flower List</h1>
      {flowers.map((flower) => (
        <FlowerItem
          key={flower.flowerId}
          id={flower.flowerId}
          name={flower.flowerName}
          count={flower.flowerCount}
          quantity={flower.quantity}
          flowerCost={flower.flowerCost}
          onQuantityChange={handleQuantityChange}
        />
      ))}
      <CreateBouquet flowers={selectedFlowers} />
    </div>
  );
};

export default FlowerList;
