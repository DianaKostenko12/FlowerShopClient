import React, { useState, useEffect } from "react";
import FlowerItem from "./FlowerItem";
import FlowerService from "../../../API/FlowerService";
import classes from "./flowerList.module.css";

interface Flower {
  id: number;
  name: string;
  cost: number;
  photo: string;
  selectedQuantity: number;
  availableQuantity: number;
}

interface FlowerListProps {
  selectedFlowers: Flower[];
  onIncrementFlower: (flower: Flower) => void;
  onDecrementFlower: (flower: Flower) => void;
}

const FlowerList: React.FC<FlowerListProps> = ({
  selectedFlowers,
  onIncrementFlower,
  onDecrementFlower,
}) => {
  const [availableFlowers, setAvailableFlowers] = useState<Flower[]>([]);

  useEffect(() => {
    const initialFlowers = async () => {
      try {
        const response = await FlowerService.getFlowers();
        const flowers: Flower[] = response.data.map((flower) => ({
          ...flower,
          id: flower.flowerId,
          name: flower.flowerName,
          cost: flower.flowerCost,
          photo: flower.imgUrl,
          availableQuantity: flower.flowerCount,
          selectedQuantity: 0,
        }));

        setAvailableFlowers(flowers);
      } catch (error) {
        console.error("Error fetching flowers:", error);
      }
    };
    initialFlowers();
  }, []);

  return (
    <div>
      <h3>Квіти</h3>
      <div className={`${classes.flowerList}`}>
        {availableFlowers.map((flower) => (
          <FlowerItem
            key={flower.id}
            flower={flower}
            selectedFlowers={selectedFlowers}
            onIncrementFlower={onIncrementFlower}
            onDecrementFlower={onDecrementFlower}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowerList;
