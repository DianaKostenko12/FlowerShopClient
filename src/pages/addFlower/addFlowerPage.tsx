import React, { useState } from "react";
import FlowerService from "../../API/FlowerService";
import classes from "./addFlowerPage.module.css";

interface AddFlowerProps {
  flowerName: string;
  flowerCount: number;
  flowerCost: number;
  photo: File;
}

const AddFlowerPage = () => {
  const [name, setName] = useState<string>("");
  const [count, setCount] = useState<string>(""); // Рядок замість числа
  const [cost, setCost] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null); // Рядок замість числа
  const [error, setError] = useState<string>("");

  const handleAddFlower = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const parsedCount = parseInt(count, 10);
    const parsedCost = parseFloat(cost);

    if (
      !name.trim() ||
      isNaN(parsedCount) ||
      parsedCount <= 0 ||
      isNaN(parsedCost) ||
      parsedCost <= 0 ||
      !photo
    ) {
      setError("Заповніть всі поля коректними даними.");
      return;
    }

    const flowerToAdd: AddFlowerProps = {
      flowerName: name,
      flowerCount: parsedCount,
      flowerCost: parsedCost,
      photo: photo,
    };

    try {
      const response = await FlowerService.addFlower(flowerToAdd);
      console.log("Flower added successfully:", response.data);

      setName("");
      setCount("");
      setCost("");
      setPhoto(null);
      setError("");
    } catch (err) {
      console.error("Failed to add a flower:", err);
      setError("Не вдалося додати квітку. Спробуйте ще раз.");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleAddFlower}>
        <div className={classes.inputGroup}>
          <label>Назва квітки</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введіть назву квітки"
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Кількість</label>
          <input
            type="text" // Змінено з number на text
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Введіть кількість"
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Вартість (шт/грн)</label>
          <input
            type="text"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Введіть вартість"
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Фото</label>
          <div className={classes.fileInputWrapper}>
            <input
              type="file"
              onChange={handlePhotoChange}
              id="photoInput"
              className={classes.fileInput}
            />
            <label htmlFor="photoInput" className={classes.filePlaceholder}>
              {photo ? photo.name : "Виберіть фото"}
            </label>
          </div>
        </div>
        {error && <p className={classes.error}>{error}</p>}
        <button type="submit" className={classes.addButton}>
          Додати
        </button>
      </form>
    </div>
  );
};

export default AddFlowerPage;
