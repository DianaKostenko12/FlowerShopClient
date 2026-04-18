import { useMemo, useState } from "react";
import { Flower } from "../types";

export const useSelectedFlowers = () => {
  const [selectedFlowers, setSelectedFlowers] = useState<Flower[]>([]);

  const incrementFlower = (flower: Flower) => {
    setSelectedFlowers((prev) => {
      const flowerIndex = prev.findIndex((f) => f.id === flower.id);

      if (flowerIndex !== -1) {
        const selectedFlower = prev[flowerIndex];

        if (selectedFlower.selectedQuantity >= flower.availableQuantity) {
          return prev;
        }

        const updatedFlowers = [...prev];
        updatedFlowers[flowerIndex] = {
          ...selectedFlower,
          selectedQuantity: selectedFlower.selectedQuantity + 1,
        };

        return updatedFlowers;
      }

      return [...prev, { ...flower, selectedQuantity: 1 }];
    });
  };

  const decrementFlower = (flower: Flower) => {
    setSelectedFlowers((prev) => {
      const flowerIndex = prev.findIndex((f) => f.id === flower.id);

      if (flowerIndex !== -1) {
        const selectedFlower = prev[flowerIndex];

        if (selectedFlower.selectedQuantity <= 1) {
          return prev.filter((f) => f.id !== flower.id);
        }

        const updatedFlowers = [...prev];
        updatedFlowers[flowerIndex] = {
          ...selectedFlower,
          selectedQuantity: selectedFlower.selectedQuantity - 1,
        };

        return updatedFlowers;
      }

      return prev;
    });
  };

  const removeFlower = (flowerId: number) => {
    setSelectedFlowers((prev) => prev.filter((f) => f.id !== flowerId));
  };

  const resetSelectedFlowers = () => {
    setSelectedFlowers([]);
  };

  const totalPrice = useMemo(
    () =>
      selectedFlowers.reduce(
        (sum, flower) => sum + flower.cost * flower.selectedQuantity,
        0
      ),
    [selectedFlowers]
  );

  return {
    selectedFlowers,
    incrementFlower,
    decrementFlower,
    removeFlower,
    resetSelectedFlowers,
    totalPrice,
  };
};
