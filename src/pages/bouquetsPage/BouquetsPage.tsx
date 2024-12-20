import React, { useEffect, useState } from "react";
import BouquetsList from "../createBouquet/bouquet/bouquetList/BouquetsList";
import { AxiosResponse } from "axios";
import BouquetService from "../../API/BouquetService";
import { useFlowers } from "../../common/FlowerContext";
import { useNavigate } from "react-router-dom";
import styles from "./boquetsPage.module.css"; // Імпорт CSS-модулів
import FlowerService from "../../API/FlowerService";
import { FlowerRequest } from "../flowerPage/flowerPage";

interface BouquetInfo {
  bouquetId: number;
  bouquetName: string;
  price: number;
  photoFileName: string;
}

interface BouquetFilterInfo {
  minPrice?: number;
  maxPrice?: number;
  flowerIds?: number[];
}

const BouquetsPage = () => {
  const [bouquetInfo, setBouquetInfo] = useState<BouquetInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | "">(0);
  const [maxPrice, setMaxPrice] = useState<number | "">(0);
  const [flowerIds, setFlowerIds] = useState<number[]>([]);
  const { setSelectedFlowers } = useFlowers();
  const navigate = useNavigate();
  const [flowers, setFlowers] = useState<FlowerRequest[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCreateBouquetClick = () => {
    navigate("/create-bouquet");
  };

  const handleFilterChange = () => {
    fetchBouquetInfo();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFlowerSelect = (flowerId: number) => {
    setFlowerIds((prev) =>
      prev.includes(flowerId)
        ? prev.filter((id) => id !== flowerId)
        : [...prev, flowerId],
    );
  };

  const fetchBouquetInfo = async () => {
    try {
      const bouquetFilterInfo: BouquetFilterInfo = {
        minPrice: minPrice === "" ? undefined : minPrice,
        maxPrice: maxPrice === "" ? undefined : maxPrice,
        flowerIds: flowerIds.length > 0 ? flowerIds : undefined,
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
    const initialFlowers = async () => {
      try {
        const response = await FlowerService.getFlowers();
        setFlowers(response.data);
      } catch (error) {
        console.error("Error fetching flowers:", error);
      }
    };
    initialFlowers();
  }, []);

  return (
    <div className={styles.bouquetPage}>
      <div className={styles.filters}>
        <div>
          <div>
            <input
              type="number"
              value={minPrice || ""}
              placeholder="Мінімальна ціна"
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : "")
              }
            />
          </div>
          <div>
            <input
              type="number"
              value={maxPrice || ""}
              placeholder="Максимальна ціна"
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : "")
              }
            />
          </div>
        </div>

        <div className={styles.dropdownContainer}>
          <div
            className={styles.dropdown}
            onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}
          >
            <button className={styles.dropdownButton}>
              <h6>Квіти</h6> <img src="/down.png" alt="" />
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownList}>
                {flowers.map((flower: FlowerRequest) => (
                  <li
                    key={flower.flowerId}
                    className={
                      flowerIds.includes(flower.flowerId)
                        ? styles.selectedItem
                        : ""
                    }
                    onClick={() => handleFlowerSelect(flower.flowerId)}
                  >
                    {flower.flowerName}
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
          Create Bouquet
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
