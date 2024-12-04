import React, { FC } from "react";

interface FlowerItemProps {
  id: number;
  name: string;
  count: number; // Загальна кількість квітів
  quantity: number; // Кількість, яку замовляє користувач
  flowerCost: number; // Вартість однієї квітки
  onQuantityChange: (id: number, newQuantity: number) => void;
}

const FlowerItem: FC<FlowerItemProps> = ({
  id,
  name,
  count,
  quantity,
  flowerCost,
  onQuantityChange,
}) => {
  const increment = () => {
    if (quantity < count) {
      onQuantityChange(id, quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 0) {
      onQuantityChange(id, quantity - 1);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
      <h5>{name}</h5>
      <span style={{ margin: "0 10px" }}>Cost: ${flowerCost.toFixed(2)}</span>
      <div className="counter">
        <button onClick={decrement} disabled={quantity <= 0}>
          -
        </button>
        <span style={{ margin: "0 10px" }}>{quantity}</span>
        <button onClick={increment} disabled={quantity >= count}>
          +
        </button>
      </div>
    </div>
  );
};

export default FlowerItem;
