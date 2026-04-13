import React, { useEffect, useRef, useState } from "react";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import BouquetService from "../../API/BouquetService";
import BouquetsList from "../createBouquet/bouquet/bouquetList/BouquetsList";
import styles from "./boquetsPage.module.css";
import CategoryService, { CategoryInfo } from "../../API/CategoryService";

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
}

const PRICE_MIN = 0;
const PRICE_MAX = 10000;

const BouquetsPage = () => {
  const [bouquetInfo, setBouquetInfo] = useState<BouquetInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [categoriesListIds, setcategoriesListIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleCreateBouquetClick = () => {
    navigate("/create-bouquet");
  };

  const handleFilterChange = () => {
    fetchBouquetInfo();
  };

  const handleCategorySelect = (categoryId: number) => {
    setcategoriesListIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const fetchBouquetInfo = async () => {
    try {
      const bouquetFilterInfo: BouquetFilterInfo = {
        minPrice: priceRange[0] === PRICE_MIN ? undefined : priceRange[0],
        maxPrice: priceRange[1] === PRICE_MAX ? undefined : priceRange[1],
        categoriesIds:
          categoriesListIds.length > 0 ? categoriesListIds : undefined,
      };

      const response: AxiosResponse<BouquetInfo[]> =
        await BouquetService.getBouquets(bouquetFilterInfo);
      setBouquetInfo(response.data);
    } catch (error) {
      console.error("Error fetching bouquets:", error);
      setError("Не вдалося завантажити дані букетів");
    }
  };

  useEffect(() => {
    fetchBouquetInfo();
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.bouquetPage}>
      <div className={styles.filters}>
        <div className={styles.priceSliderContainer}>
          <label className={styles.priceSliderLabel}>
            Ціна: {priceRange[0]} – {priceRange[1]} грн
          </label>
          <Slider
            range
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            className={styles.priceSlider}
          />
        </div>

        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <div className={styles.dropdown}>
            <button
              type="button"
              className={`${styles.customButton} ${styles.dropdownButton}`}
              onClick={handleDropdownToggle}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className={styles.dropdownLabel}>{"Вид квітки"}</span>
              <span className={styles.dropdownArrow} aria-hidden="true" />
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownList} role="listbox">
                {categories.map((category: CategoryInfo) => (
                  <li
                    key={category.categoryId}
                    className={
                      categoriesListIds.includes(category.categoryId)
                        ? styles.selectedItem
                        : ""
                    }
                    onClick={() => handleCategorySelect(category.categoryId)}
                  >
                    {category.categoryName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button onClick={handleFilterChange} className={styles.customButton}>
          Застосувати фільтри
        </button>
        <button
          onClick={handleCreateBouquetClick}
          className={`${styles.customButton} ${styles.additionalStyle}`}
        >
          Створити букет
        </button>
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
