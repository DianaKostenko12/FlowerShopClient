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

const clampPrice = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const BouquetsPage = () => {
  const [bouquetInfo, setBouquetInfo] = useState<BouquetInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);
  const [priceInputs, setPriceInputs] = useState<{ min: string; max: string }>({
    min: String(PRICE_MIN),
    max: String(PRICE_MAX),
  });
  const [categoriesListIds, setcategoriesListIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [minPrice, maxPrice] = priceRange;

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

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setPriceRange([value[0], value[1]]);
    }
  };

  const handlePriceInputChange = (field: "min" | "max", value: string) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    setPriceInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const commitPriceInput = (field: "min" | "max") => {
    const rawValue = priceInputs[field];
    const parsedValue =
      rawValue === ""
        ? field === "min"
          ? PRICE_MIN
          : PRICE_MAX
        : Number(rawValue);

    if (field === "min") {
      const nextMin = clampPrice(parsedValue, PRICE_MIN, maxPrice);
      setPriceRange([nextMin, maxPrice]);
      return;
    }

    const nextMax = clampPrice(parsedValue, minPrice, PRICE_MAX);
    setPriceRange([minPrice, nextMax]);
  };

  const fetchBouquetInfo = async () => {
    try {
      const bouquetFilterInfo: BouquetFilterInfo = {
        minPrice: minPrice === PRICE_MIN ? undefined : minPrice,
        maxPrice: maxPrice === PRICE_MAX ? undefined : maxPrice,
        categoriesIds:
          categoriesListIds.length > 0 ? categoriesListIds : undefined,
      };

      const response: AxiosResponse<BouquetInfo[]> =
        await BouquetService.getBouquets(bouquetFilterInfo);
      setBouquetInfo(response.data);
    } catch (error) {
      console.error("Error fetching bouquets:", error);
      setError("�� ������� ����������� ���� ������");
    }
  };

  useEffect(() => {
    setPriceInputs({
      min: String(minPrice),
      max: String(maxPrice),
    });
  }, [minPrice, maxPrice]);

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
          <div className={styles.priceInputsRow}>
            <label className={styles.priceInputGroup}>
              <span className={styles.priceSliderLabel}>Мін. ціна</span>
              <input
                type="text"
                inputMode="numeric"
                value={priceInputs.min}
                onChange={(event) =>
                  handlePriceInputChange("min", event.target.value)
                }
                onBlur={() => commitPriceInput("min")}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    commitPriceInput("min");
                    event.currentTarget.blur();
                  }
                }}
                className={styles.priceInput}
              />
            </label>
            <label className={styles.priceInputGroup}>
              <span className={styles.priceSliderLabel}>Макс. ціна</span>
              <input
                type="text"
                inputMode="numeric"
                value={priceInputs.max}
                onChange={(event) =>
                  handlePriceInputChange("max", event.target.value)
                }
                onBlur={() => commitPriceInput("max")}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    commitPriceInput("max");
                    event.currentTarget.blur();
                  }
                }}
                className={styles.priceInput}
              />
            </label>
          </div>
          <Slider
            range
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            value={priceRange}
            onChange={handleSliderChange}
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
