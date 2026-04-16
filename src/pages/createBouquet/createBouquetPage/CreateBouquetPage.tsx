import React, { FC, useRef, useState } from "react";
import BouquetService from "../../../API/BouquetService";
import MultiSelectDropdown, {
  MultiSelectOption,
} from "../../bouquetsPage/MultiSelectDropdown";
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

const colorOptions: MultiSelectOption[] = [
  { id: "червоний", label: "Червоний" },
  { id: "рожевий", label: "Рожевий" },
  { id: "білий", label: "Білий" },
  { id: "жовтий", label: "Жовтий" },
  { id: "помаранчевий", label: "Помаранчевий" },
  { id: "фіолетовий", label: "Фіолетовий" },
  { id: "синій", label: "Синій" },
  { id: "блакитний", label: "Блакитний" },
  { id: "зелений", label: "Зелений" },
  { id: "бежевий", label: "Бежевий" },
];

const shapeOptions: MultiSelectOption[] = [
  { id: "кругла", label: "Кругла" },
  { id: "подовжена", label: "Подовжена" },
  { id: "асиметрична", label: "Асиметрична" },
];

const CreateBouquetPage: FC = () => {
  const [bouquetName, setBouquetName] = useState<string>("");
  const [bouquetDescription, setBouquetDescription] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [selectedFlowers, setSelectedFlowers] = useState<Flower[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [shape, setSelectedShape] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMultiSelectValue = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!photo) {
      setError("Будь ласка, оберіть фото для букету.");
      return;
    }

    const bouquetToCreate = {
      bouquetName,
      bouquetDescription,
      photo,
      shape: shape,
      flowers: selectedFlowers.map((flower) => ({
        flowerId: flower.id,
        flowerCount: flower.selectedQuantity,
      })),
    };

    try {
      const response = await BouquetService.createBouquet(bouquetToCreate);
      console.log("Bouquet created successfully:", response.data);

      setBouquetName("");
      setBouquetDescription("");
      setPhoto(null);
      setSelectedFlowers([]);
      setSelectedColors([]);
      setSelectedShape("");
    } catch (error) {
      console.error("Failed to create a bouquet:", error);
      setError("Не вдалося створити букет. Спробуйте ще раз.");
    }
  };

  const totalPrice = selectedFlowers.reduce(
    (sum, f) => sum + f.cost * f.selectedQuantity,
    0
  );

  return (
    <div className="container-fluid p-4">
      {/* Page Header */}
      <div className={classes.pageHeader}>
        <h2 className={classes.pageTitle}>Створення букету</h2>
        <p className={classes.pageSubtitle}>
          Оберіть квіти та налаштуйте ваш ідеальний букет
        </p>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Left Panel — Form */}
        <div className="col-lg-4">
          <div className={classes.formCard}>
            {/* Section: Basic Info */}
            <div className={classes.formSection}>
              <div className={classes.formSectionTitle}>Основна інформація</div>
              <label className={classes.formLabel}>Назва букету</label>
              <input
                type="text"
                className={classes.formInput}
                value={bouquetName}
                onChange={(e) => setBouquetName(e.target.value)}
                placeholder="Введіть назву..."
              />
              <label className={classes.formLabel}>Опис букету</label>
              <textarea
                className={classes.formTextarea}
                value={bouquetDescription}
                onChange={(e) => setBouquetDescription(e.target.value)}
                placeholder="Опишіть ваш букет..."
              />
            </div>

            {/* Section: Parameters */}
            <div className={classes.formSection}>
              <div className={classes.formSectionTitle}>Параметри букету</div>
              <label className={classes.formLabel}>Форма букету</label>
              <div className={classes.dropdownWrapper}>
                <select
                  className={classes.formInput}
                  value={shape ?? ""}
                  onChange={(e) => setSelectedShape(e.target.value)}
                >
                  <option value="">Оберіть форму</option>
                  {shapeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <label className={classes.formLabel}>Колір букету</label>
              <div className={classes.dropdownWrapper}>
                <MultiSelectDropdown
                  label="Оберіть кольори"
                  options={colorOptions}
                  selectedIds={selectedColors}
                  onSelect={(optionId) =>
                    toggleMultiSelectValue(String(optionId), setSelectedColors)
                  }
                />
              </div>
            </div>

            {/* Section: Photo */}
            <div className={classes.formSection}>
              <div className={classes.formSectionTitle}>Фото букету</div>
              <div
                className={`${classes.dropZone} ${isDragging ? classes.dropZoneActive : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className={classes.dropZoneIcon}>📷</span>
                <p className={classes.dropZoneText}>
                  Перетягніть фото сюди або натисніть для вибору
                </p>
                {photo && (
                  <p className={classes.dropZoneFileName}>{photo.name}</p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
              </div>
              {photo && (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Превʼю"
                  className={classes.photoPreview}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel — Flowers */}
        <div className="col-lg-8">
          <FlowerList
            selectedFlowers={selectedFlowers}
            onIncrementFlower={incrementFlower}
            onDecrementFlower={decrementFlower}
          />
        </div>
      </div>

      {/* Summary Section */}
      <div className={classes.summarySection}>
        <div className={classes.summaryHeader}>
          <h3 className={classes.summaryTitle}>Обрані квіти</h3>
        </div>

        {selectedFlowers.length > 0 ? (
          <div className={classes.summaryChips}>
            {selectedFlowers.map((flower) => (
              <span key={flower.id} className={classes.summaryChip}>
                {flower.name}
                <span className={classes.summaryChipQuantity}>
                  {flower.selectedQuantity}
                </span>
                <button
                  className={classes.summaryChipRemove}
                  onClick={() => removeFlower(flower.id)}
                  title="Видалити"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className={classes.emptySelection}>
            Ви ще не обрали жодної квітки
          </p>
        )}

        {error && <p className={classes.error}>{error}</p>}

        <div className={classes.summaryFooter}>
          <div className={classes.totalPrice}>
            <span className={classes.totalPriceLabel}>Загальна вартість: </span>
            {totalPrice} грн
          </div>
          <button onClick={handleCreate} className={classes.createButton}>
            Створити букет
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBouquetPage;
