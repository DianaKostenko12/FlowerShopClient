import React, { useEffect, useRef, useState } from "react";
import BouquetsList from "../components/headers/BouquetsList";
import { AxiosResponse } from "axios";
import BouquetService from "../API/BouquetService";

interface BouquetInfo {
  bouquetId: number;
  bouquetName: string;
  price: number;
}

interface BouquetFilterInfo {
  minPrice?: number;
  maxPrice?: number;
  flowerIds?: number[];
}

const Bouquets: React.FC = () => {
  const [bouquetInfo, setBouquetInfo] = useState<BouquetInfo[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>(0);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(0);
  const [flowerIds, setFlowerIds] = useState<number[] | undefined>([]);

  const bouquetFilterInfo = { minPrice, maxPrice, flowerIds };

  useEffect(() => {
    const fetchBouquetInfo = async () => {
      try {
        const response: AxiosResponse<BouquetInfo[]> =
          await BouquetService.getBouquets(bouquetFilterInfo);
        console.log(response);
        setBouquetInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Не вдалося завантажити дані користувача");
      }
    };

    fetchBouquetInfo();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!bouquetInfo) {
    return (
      <div className="text-center">
        <p>Завантаження даних...</p>
      </div>
    );
  }
  return (
    <div>
      <BouquetsList bouquets={bouquetInfo} />
    </div>
  );
};

export default Bouquets;
