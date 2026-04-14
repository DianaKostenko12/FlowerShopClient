import { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./boquetsPage.module.css";

export interface PriceFilterValue {
  minPrice?: number;
  maxPrice?: number;
}

interface PriceFilterProps {
  minLimit: number;
  maxLimit: number;
  onChange: (value: PriceFilterValue) => void;
}

const clampPrice = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const PriceFilter = ({ minLimit, maxLimit, onChange }: PriceFilterProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minLimit,
    maxLimit,
  ]);
  const [priceInputs, setPriceInputs] = useState<{ min: string; max: string }>({
    min: String(minLimit),
    max: String(maxLimit),
  });
  const [minPrice, maxPrice] = priceRange;

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
          ? minLimit
          : maxLimit
        : Number(rawValue);

    if (field === "min") {
      const nextMin = clampPrice(parsedValue, minLimit, maxPrice);
      setPriceRange([nextMin, maxPrice]);
      return;
    }

    const nextMax = clampPrice(parsedValue, minPrice, maxLimit);
    setPriceRange([minPrice, nextMax]);
  };

  useEffect(() => {
    setPriceInputs({
      min: String(minPrice),
      max: String(maxPrice),
    });
  }, [minPrice, maxPrice]);

  useEffect(() => {
    onChange({
      minPrice: minPrice === minLimit ? undefined : minPrice,
      maxPrice: maxPrice === maxLimit ? undefined : maxPrice,
    });
  }, [minPrice, maxPrice, minLimit, maxLimit, onChange]);

  return (
    <div className={styles.priceSliderContainer}>
      <div className={styles.priceInputsRow}>
        <label className={styles.priceInputGroup}>
          <span className={styles.priceSliderLabel}>Мін. ціна</span>
          <input
            type="text"
            inputMode="numeric"
            value={priceInputs.min}
            onChange={(event) => handlePriceInputChange("min", event.target.value)}
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
            onChange={(event) => handlePriceInputChange("max", event.target.value)}
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
        min={minLimit}
        max={maxLimit}
        step={50}
        value={priceRange}
        onChange={handleSliderChange}
        className={styles.priceSlider}
      />
    </div>
  );
};

export default PriceFilter;
