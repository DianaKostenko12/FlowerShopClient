import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryService, { CategoryInfo } from "../../API/CategoryService";
import ColorService, { ColorResponse } from "../../API/ColorService";
import FlowerService, {
  CreateFlowerProps,
  StemType,
} from "../../API/FlowerService";
import classes from "./addFlowerPage.module.css";
import {
  CUSTOM_CATEGORY_OPTION,
  CUSTOM_COLOR_OPTION,
  CUSTOM_SHADE_OPTION,
  STEM_TYPE_LABELS,
} from "./constants";

const AddFlowerPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [count, setCount] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [colorId, setColorId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [customColorName, setCustomColorName] = useState<string>("");
  const [customColorShade, setCustomColorShade] = useState<string>("");
  const [customShadeName, setCustomShadeName] = useState<string>("");
  const [customCategoryName, setCustomCategoryName] = useState<string>("");
  const [headSizeCm, setHeadSizeCm] = useState<string>("");
  const [stemThicknessMm, setStemThicknessMm] = useState<string>("");
  const [stemKind, setStemKind] = useState<StemType>(StemType.Standard);
  const [photo, setPhoto] = useState<File | null>(null);
  const [colors, setColors] = useState<ColorResponse[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [colorsResponse, categoriesResponse] = await Promise.all([
          ColorService.getAllColors(),
          CategoryService.getCategories(),
        ]);

        setColors(colorsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Failed to load flower options:", err);
        setError("Не вдалося завантажити кольори або категорії.");
      }
    };

    loadOptions();
  }, []);

  const resolveColorId = async (): Promise<number> => {
    if (colorId === CUSTOM_COLOR_OPTION) {
      const resolvedShade =
        customColorShade === CUSTOM_SHADE_OPTION
          ? customShadeName.trim()
          : customColorShade;
      const colorName = customColorName.trim();

      const response = await ColorService.addColor({
        colorName,
        shade: resolvedShade,
      });

      console.log(response.data.colorId);
      return response.data.colorId;
    }

    return parseInt(colorId, 10);
  };

  const resolveCategoryId = async (): Promise<number> => {
    if (categoryId === CUSTOM_CATEGORY_OPTION) {
      const categoryName = customCategoryName.trim();
      const response = await CategoryService.addCategory({
        categoryName,
      });

      return response.data.categoryId;
    }

    return parseInt(categoryId, 10);
  };

  const handleAddFlower = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const parsedCount = parseInt(count, 10);
    const parsedCost = parseFloat(cost);
    const parsedHeadSizeCm = parseInt(headSizeCm, 10);
    const parsedStemThicknessMm = parseFloat(stemThicknessMm);
    const hasCustomColor = colorId === CUSTOM_COLOR_OPTION;
    const hasCustomCategory = categoryId === CUSTOM_CATEGORY_OPTION;
    const hasCustomShade = customColorShade === CUSTOM_SHADE_OPTION;

    if (
      !name.trim() ||
      isNaN(parsedCount) ||
      parsedCount <= 0 ||
      isNaN(parsedCost) ||
      parsedCost <= 0 ||
      !colorId ||
      (hasCustomColor &&
        (!customColorName.trim() ||
          !customColorShade ||
          (hasCustomShade && !customShadeName.trim()))) ||
      !categoryId ||
      (hasCustomCategory && !customCategoryName.trim()) ||
      isNaN(parsedHeadSizeCm) ||
      parsedHeadSizeCm <= 0 ||
      isNaN(parsedStemThicknessMm) ||
      parsedStemThicknessMm <= 0 ||
      !photo
    ) {
      setError("Заповніть усі обов'язкові поля коректними даними.");
      return;
    }

    try {
      const [resolvedColorId, resolvedCategoryId] = await Promise.all([
        resolveColorId(),
        resolveCategoryId(),
      ]);

      const flowerToAdd: CreateFlowerProps = {
        flowerName: name,
        flowerCount: parsedCount,
        flowerCost: parsedCost,
        photo,
        colorId: resolvedColorId,
        categoryId: resolvedCategoryId,
        headSizeCm: parsedHeadSizeCm,
        stemThicknessMm: parsedStemThicknessMm,
        stemKind,
      };

      console.log(flowerToAdd);

      const response = await FlowerService.addFlower(flowerToAdd);
      console.log("Flower added successfully:", response.data);
      toast.success("Квітку успішно додано.");

      setName("");
      setCount("");
      setCost("");
      setColorId("");
      setCategoryId("");
      setCustomColorName("");
      setCustomColorShade("");
      setCustomShadeName("");
      setCustomCategoryName("");
      setHeadSizeCm("");
      setStemThicknessMm("");
      setStemKind(StemType.Standard);
      setPhoto(null);
      setError("");
      navigate("/flowers");
    } catch (err) {
      console.error("Failed to add a flower:", err);
      const errorMessage = "Не вдалося додати квітку. Спробуйте ще раз.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const shadeOptions = Array.from(
    new Set(colors.map((color) => color.shade).filter(Boolean))
  );

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
            type="number"
            min="1"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Введіть кількість"
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Вартість (шт/грн)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Введіть вартість"
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Колір</label>
          <select value={colorId} onChange={(e) => setColorId(e.target.value)}>
            <option value="">Оберіть колір</option>
            {colors.map((color) => (
              <option key={color.colorId} value={color.colorId}>
                {color.colorName}
              </option>
            ))}
            <option value={CUSTOM_COLOR_OPTION}>Свій колір</option>
          </select>
        </div>
        {colorId === CUSTOM_COLOR_OPTION && (
          <>
            <div className={classes.inputGroup}>
              <label>Назва кольору</label>
              <input
                type="text"
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
                placeholder="Введіть назву кольору"
              />
            </div>
            <div className={classes.inputGroup}>
              <label>Відтінок</label>
              <select
                value={customColorShade}
                onChange={(e) => setCustomColorShade(e.target.value)}
              >
                <option value="">Оберіть відтінок</option>
                {shadeOptions.map((shade) => (
                  <option key={shade} value={shade}>
                    {shade}
                  </option>
                ))}
                <option value={CUSTOM_SHADE_OPTION}>Свій відтінок</option>
              </select>
            </div>
            {customColorShade === CUSTOM_SHADE_OPTION && (
              <div className={classes.inputGroup}>
                <label>Назва відтінку</label>
                <input
                  type="text"
                  value={customShadeName}
                  onChange={(e) => setCustomShadeName(e.target.value)}
                  placeholder="Введіть свій відтінок"
                />
              </div>
            )}
          </>
        )}
        <div className={classes.inputGroup}>
          <label>Категорія</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Оберіть категорію</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
            <option value={CUSTOM_CATEGORY_OPTION}>Своя категорія</option>
          </select>
        </div>
        {categoryId === CUSTOM_CATEGORY_OPTION && (
          <div className={classes.inputGroup}>
            <label>Назва категорії</label>
            <input
              type="text"
              value={customCategoryName}
              onChange={(e) => setCustomCategoryName(e.target.value)}
              placeholder="Введіть назву категорії"
            />
          </div>
        )}
        <div className={classes.inputGroup}>
          <label>Розмір бутона (см)</label>
          <input
            type="number"
            min="1"
            value={headSizeCm}
            onChange={(e) => setHeadSizeCm(e.target.value)}
            placeholder="Введіть розмір бутона"
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Товщина стебла (мм)</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={stemThicknessMm}
            onChange={(e) => setStemThicknessMm(e.target.value)}
            placeholder="Введіть товщину стебла"
          />
        </div>
        <div className={classes.inputGroup}>
          <label>Тип стебла</label>
          <select
            value={stemKind}
            onChange={(e) => setStemKind(e.target.value as StemType)}
          >
            {Object.values(StemType).map((type) => (
              <option key={type} value={type}>
                {STEM_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
        <div className={classes.inputGroup}>
          <label>Фото</label>
          <div className={classes.fileInputWrapper}>
            <input
              type="file"
              accept="image/*"
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
