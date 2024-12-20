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

  const handleCreateBouquetClick = () => {
    navigate("/create-bouquet");
  };

  const handleFilterChange = () => {
    fetchBouquetInfo();
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
        <button
          onClick={handleCreateBouquetClick}
          className={`btn btn-primary ${styles.customButton}`}
        >
          Create Bouquet
        </button>

        <div>
          <label>Мінімальна ціна:</label>
          <input
            type="number"
            value={minPrice || ""}
            onChange={(e) =>
              setMinPrice(e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>
        <div>
          <label>Максимальна ціна:</label>
          <input
            type="number"
            value={maxPrice || ""}
            onChange={(e) =>
              setMaxPrice(e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>
        <div>
          <label>Квіти:</label>
          <select
            multiple
            value={flowerIds.map(String)}
            onChange={(e) =>
              setFlowerIds(
                Array.from(e.target.selectedOptions, (option) =>
                  Number(option.value),
                ),
              )
            }
          >
            {flowers.map((flower: FlowerRequest) => (
              <option key={flower.flowerId} value={flower.flowerId}>
                {flower.flowerName}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleFilterChange} className="btn btn-primary">
          Застосувати фільтри
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {bouquetInfo.length > 0 ? (
        <BouquetsList bouquets={bouquetInfo} />
      ) : (
        <div className="text-center">
          <p>Завантаження даних...</p>
        </div>
      )}
    </div>
  );
};

export default BouquetsPage;
