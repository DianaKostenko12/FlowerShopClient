import React, { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import BouquetService from "../../API/BouquetService";
import { useAuth } from "../../common/AuthContext";
import BouquetsList from "./bouquet/bouquetList/BouquetsList";
import styles from "./boquetsPage.module.css";
import CategoryService, { CategoryInfo } from "../../API/CategoryService";
import PriceFilter, { PriceFilterValue } from "./PriceFilter";
import MultiSelectDropdown, { MultiSelectOption } from "./MultiSelectDropdown";

interface BouquetInfo {
  bouquetId: number;
  bouquetName: string;
  price: number;
  photoFileName: string;
}

interface BouquetFilterInfo {
  minPrice?: number;
  maxPrice?: number;
  categoriesIds?: number[];
  shapesList?: string[];
  colorsList?: string[];
}

const PRICE_MIN = 0;
const PRICE_MAX = 10000;

const flowerColors = [
  "червоний",
  "рожевий",
  "білий",
  "жовтий",
  "помаранчевий",
  "фіолетовий",
  "синій",
  "блакитний",
  "зелений",
  "бежевий",
];

const shapes = ["подовжена", "кругла", "асиметрична"];

const BouquetsPage = () => {
  const [bouquetInfo, setBouquetInfo] = useState<BouquetInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceFilterValue>({});
  const [categoriesListIds, setCategoriesListIds] = useState<number[]>([]);
  const [flowerColorsList, setFlowerColorsList] = useState<string[]>([]);
  const [shapesList, setShapesList] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const navigate = useNavigate();
  const { isAuthorized, userRole } = useAuth();
  const isAdmin = userRole === "Admin";

  const categoryOptions: MultiSelectOption[] = categories.map((category) => ({
    id: category.categoryId,
    label: category.categoryName,
  }));

  const flowerColorOptions: MultiSelectOption[] = flowerColors.map((color) => ({
    id: color,
    label: color,
  }));

  const flowerShapeOptions: MultiSelectOption[] = shapes.map((shape) => ({
    id: shape,
    label: shape,
  }));

  const handleFlowerColorsSelect = (colorName: string) => {
    setFlowerColorsList((prev) =>
      prev.includes(colorName)
        ? prev.filter((name) => name !== colorName)
        : [...prev, colorName]
    );
  };

  const handleShapesSelect = (shapeName: string) => {
    setShapesList((prev) =>
      prev.includes(shapeName)
        ? prev.filter((name) => name !== shapeName)
        : [...prev, shapeName]
    );
  };

  const handleCreateBouquetClick = () => {
    navigate("/create-bouquet");
  };

  const handleCategorySelect = (categoryId: number | string) => {
    const normalizedCategoryId = Number(categoryId);

    setCategoriesListIds((prev) =>
      prev.includes(normalizedCategoryId)
        ? prev.filter((id) => id !== normalizedCategoryId)
        : [...prev, normalizedCategoryId]
    );
  };

  const handlePriceChange = useCallback((value: PriceFilterValue) => {
    setPriceFilter(value);
  }, []);

  const fetchBouquetInfo = useCallback(async () => {
    try {
      const bouquetFilterInfo: BouquetFilterInfo = {
        minPrice: priceFilter.minPrice,
        maxPrice: priceFilter.maxPrice,
        categoriesIds:
          categoriesListIds.length > 0 ? categoriesListIds : undefined,
        colorsList: flowerColorsList.length > 0 ? flowerColorsList : undefined,
        shapesList: shapesList.length > 0 ? shapesList : undefined,
      };

      const response: AxiosResponse<BouquetInfo[]> =
        await BouquetService.getBouquets(bouquetFilterInfo);
      setBouquetInfo(response.data);
    } catch (error) {
      console.error("Error fetching bouquets:", error);
      setError("Не вдалося завантажити дані букетів");
    }
  }, [
    shapesList,
    categoriesListIds,
    flowerColorsList,
    priceFilter.maxPrice,
    priceFilter.minPrice,
  ]);

  useEffect(() => {
    fetchBouquetInfo();
  }, [fetchBouquetInfo]);

  useEffect(() => {
    const categoriesList = async () => {
      try {
        const response = await CategoryService.getCategories();
        setCategories(response.data);
      } catch (fetchError) {
        console.error("Error fetching flower categories:", fetchError);
      }
    };

    categoriesList();
  }, []);

  return (
    <div className={styles.bouquetPage}>
      <div className={styles.filters}>
        <PriceFilter
          minLimit={PRICE_MIN}
          maxLimit={PRICE_MAX}
          onChange={handlePriceChange}
        />
        <MultiSelectDropdown
          label="Вид квітки"
          options={categoryOptions}
          selectedIds={categoriesListIds}
          onSelect={handleCategorySelect}
        />
        <MultiSelectDropdown
          label="Колір"
          options={flowerColorOptions}
          selectedIds={flowerColorsList}
          onSelect={(optionId) => handleFlowerColorsSelect(String(optionId))}
        />
        <MultiSelectDropdown
          label="Форма"
          options={flowerShapeOptions}
          selectedIds={shapesList}
          onSelect={(optionId) => handleShapesSelect(String(optionId))}
        />
        <div className={styles.actionButtons}>
          <button onClick={fetchBouquetInfo} className={styles.customButton}>
            Застосувати фільтри
          </button>
          {isAuthorized && (
            <button
              onClick={() => navigate("/create-ai-bouquet")}
              className={styles.customButton}
            >
              ✨ Створити AI-букет
            </button>
          )}
          {isAdmin && (
            <button
              onClick={handleCreateBouquetClick}
              className={styles.customButton}
            >
              Створити букет
            </button>
          )}
        </div>
      </div>

      {error && <div className={`${styles.alert} alert-danger`}>{error}</div>}

      {bouquetInfo.length > 0 ? (
        <BouquetsList bouquets={bouquetInfo} />
      ) : (
        <div className={styles.textCenter}>
          <p>Завантаження даних...</p>
        </div>
      )}
    </div>
  );
};

export default BouquetsPage;
