import React, { FC, useState } from "react";
import { Bouquet } from "../bouquet/bouquetItem/BouquetItem";
import UserService from "../../../API/UserService";
import BouquetService from "../../../API/BouquetService";
import { useFlowers } from "../../../common/FlowerContext";
import FlowerList from "../flower/FlowerList";
import classes from "./createBouquet.module.css";

interface Flower {
  id: number;
  name: string;
  cost: number;
  selectedQuantity: number;
  availableQuantity: number;
}
const CreateBouquetPage: FC = () => {
  const [bouquetName, setBouquetName] = useState<string>("");
  const [bouquetDescription, setBouquetDescription] = useState<string>("");
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
      } else {
        return [...prev, { ...flower, selectedQuantity: 1 }];
      }
    });
  };

  const decrementFlower = (flower: Flower) => {
    setSelectedFlowers((prev) => {
      const flowerIndex = prev.findIndex((f) => f.id === flower.id);
      if (flowerIndex !== -1) {
        const selectedFlower = prev[flowerIndex];
        if (selectedFlower.selectedQuantity <= 1) {
          return prev.filter((f) => f.id !== flower.id); // Видаляємо квітку
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

  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const bouquetToCreate = {
      bouquetName,
      bouquetDescription,
      flowers: selectedFlowers.map((flower) => ({
        flowerId: flower.id,
        flowerCount: flower.selectedQuantity,
      })),
    };

    console.log(bouquetToCreate);
    try {
      const response = await BouquetService.createBouquet(bouquetToCreate);
      console.log("Bouquet created successfully:", response.data);

      setBouquetName("");
      setBouquetDescription("");
      setSelectedFlowers([]);
    } catch (error) {
      console.error("Failed to create a bouquet:", error);
    }
  };

  return (
    <div>
      <h2 className={classes.title}>Створення букету</h2>
      <div className={classes.createBouquetCard}>
        <div className={classes.bouquetInfo}>
          <label className={`${classes.formLabel} small`}>Назва букету</label>
          <input
            type="text"
            value={bouquetName}
            onChange={(e) => setBouquetName(e.target.value)}
          />
          <label className={`${classes.formLabel} small`}>Опис букету</label>
          <textarea
            value={bouquetDescription}
            onChange={(e) => setBouquetDescription(e.target.value)}
          ></textarea>
        </div>
        <div className={classes.flowerList}>
          <FlowerList
            selectedFlowers={selectedFlowers}
            onIncrementFlower={incrementFlower}
            onDecrementFlower={decrementFlower}
          />
        </div>
      </div>
      <button onClick={handleCreate} className={classes.button}>
        Створити
      </button>
    </div>
  );
};

export default CreateBouquetPage;
