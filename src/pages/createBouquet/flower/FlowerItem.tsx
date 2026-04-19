import React, { FC } from "react";
import classes from "./flowerItem.module.css";
import { Flower } from "../types";

interface FlowerItemProps {
  flower: Flower;
  selectedFlowers: Flower[];
  selectedRole: string;
  onIncrementFlower: (flower: Flower, role: string) => void;
  onDecrementFlower: (flower: Flower, role: string) => void;
}

const FlowerItem: FC<FlowerItemProps> = ({
  flower,
  selectedFlowers,
  selectedRole,
  onIncrementFlower,
  onDecrementFlower,
}) => {
  const selectedFlower = selectedFlowers.find(
    (f) => f.id === flower.id && f.role === selectedRole
  );
  const selectedQuantity = selectedFlower ? selectedFlower.selectedQuantity : 0;
  const totalSelectedQuantity = selectedFlowers
    .filter((f) => f.id === flower.id)
    .reduce((sum, f) => sum + f.selectedQuantity, 0);

  return (
    <div
      className={`${classes.flowerItem} ${selectedQuantity > 0 ? classes.selected : ""}`}
    >
      <div className={classes.imageWrapper}>
        <img
          src={flower.photo}
          alt={flower.name}
          className={classes.flowerImage}
        />
        <span className={classes.badge}>
          Залишок: {flower.availableQuantity}
        </span>
      </div>
      <div className={classes.cardBody}>
        <h4 className={classes.flowerName}>{flower.name}</h4>
        <p className={classes.flowerPrice}>{flower.cost} грн</p>
        <div className={classes.counter}>
          <button
            className={classes.counterBtn}
            onClick={() => onDecrementFlower(flower, selectedRole)}
            disabled={selectedQuantity <= 0}
          >
            −
          </button>
          <span className={classes.flowerQuantity}>{selectedQuantity}</span>
          <button
            className={classes.counterBtn}
            onClick={() => onIncrementFlower(flower, selectedRole)}
            disabled={totalSelectedQuantity >= flower.availableQuantity}
          >
            +
          </button>
        </div>
        {selectedQuantity > 0 && (
          <span className={classes.subtotal}>
            {flower.cost * selectedQuantity} грн
          </span>
        )}
      </div>
    </div>
  );
};

export default FlowerItem;
