import React, { FC, useState } from "react";
import BouquetService from "../../../API/BouquetService";
import FlowerList from "../flower/FlowerList";
import classes from "./createBouquet.module.css";

interface Flower {
  id: number;
  name: string;
  cost: number;
  photo: string;
  selectedQuantity: number;
  availableQuantity: number;
}

const CreateBouquetPage: FC = () => {
  const [bouquetName, setBouquetName] = useState<string>("");
  const [bouquetDescription, setBouquetDescription] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [selectedFlowers, setSelectedFlowers] = useState<Flower[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!photo) {
      setError("Будь ласка, оберіть фото для букета.");
      return;
    }
    const bouquetToCreate = {
      bouquetName,
      bouquetDescription,
      photo,
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
      setPhoto(null);
      setSelectedFlowers([]);
    } catch (error) {
      console.error("Failed to create a bouquet:", error);
      setError("Не вдалося створити букет. Спробуйте ще раз.");
    }
  };

  return (
    <div className="p-4 pe-0">
      <h2 className={classes.title}>Створення букету</h2>
      <div className="row w-100">
        <div className={"col-4 col-xl-3 " + classes.bouquetInfo}>
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
          <label className="formLabel">Фото</label>
          <div className="fileInputWrapper">
            <input
              type="file"
              onChange={handlePhotoChange}
              id="photoInput"
              className="fileInput"
            />
          </div>
          {error && <p className={classes.error}>{error}</p>}
          <button onClick={handleCreate} className={classes.button}>
            Створити
          </button>
        </div>

        <div className={"col-8 col-xl-9 " + classes.flowerList}>
          <FlowerList
            selectedFlowers={selectedFlowers}
            onIncrementFlower={incrementFlower}
            onDecrementFlower={decrementFlower}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBouquetPage;
