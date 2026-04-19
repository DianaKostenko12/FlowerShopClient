import { useMemo, useState } from "react";
import { Flower } from "../types";

export const useSelectedFlowers = () => {
  const [selectedFlowers, setSelectedFlowers] = useState<Flower[]>([]);

  const incrementFlower = (flower: Flower, role: string) => {
    setSelectedFlowers((prev) => {
      const selectedFlowerCount = prev
        .filter((f) => f.id === flower.id)
        .reduce((sum, f) => sum + f.selectedQuantity, 0);

      if (selectedFlowerCount >= flower.availableQuantity) {
        return prev;
      }

      const flowerIndex = prev.findIndex(
        (f) => f.id === flower.id && f.role === role
      );

      if (flowerIndex !== -1) {
        const selectedFlower = prev[flowerIndex];

        const updatedFlowers = [...prev];
        updatedFlowers[flowerIndex] = {
          ...selectedFlower,
          selectedQuantity: selectedFlower.selectedQuantity + 1,
        };

        return updatedFlowers;
      }

      return [...prev, { ...flower, role, selectedQuantity: 1 }];
    });
  };

  const decrementFlower = (flower: Flower, role: string) => {
    setSelectedFlowers((prev) => {
      const flowerIndex = prev.findIndex(
        (f) => f.id === flower.id && f.role === role
      );

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

  const removeFlower = (flowerId: number, role: string) => {
    setSelectedFlowers((prev) =>
      prev.filter((f) => f.id !== flowerId || f.role !== role)
    );
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
