import React, { FC } from "react";
import classes from "./flowerItem.module.css";

interface Flower {
  id: number;
  name: string;
  cost: number;
  photo: string;
  selectedQuantity: number;
  availableQuantity: number;
}

interface FlowerItemProps {
  flower: Flower;
  selectedFlowers: Flower[];
  onIncrementFlower: (flower: Flower) => void;
  onDecrementFlower: (flower: Flower) => void;
}

const FlowerItem: FC<FlowerItemProps> = ({
  flower,
  selectedFlowers,
  onIncrementFlower,
  onDecrementFlower,
}) => {
  const selectedFlower = selectedFlowers.find((f) => f.id === flower.id);
  const selectedQuantity = selectedFlower ? selectedFlower.selectedQuantity : 0;

  return (
    <div className={classes.flowerItem}>
      <img src={flower.photo} alt={flower.name} />
      <p>{flower.name}</p>
      <p>Ціна: {flower.cost} грн </p>
      <div className={classes.counter}>
        <button
          onClick={() => onIncrementFlower(flower)}
          disabled={selectedQuantity >= flower.availableQuantity}
        >
          +
        </button>
        <span className={classes.flowerQuantity}>{selectedQuantity}</span>
        <button
          onClick={() => onDecrementFlower(flower)}
          disabled={selectedQuantity <= 0}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default FlowerItem;
