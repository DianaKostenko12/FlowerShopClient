import React, { useEffect, useRef, useState } from "react";
import BouquetsList from "../createBouquet/bouquet/BouquetsList";
import { AxiosResponse } from "axios";
import BouquetService from "../../API/BouquetService";
import { useFlowers } from "../../common/FlowerContext";
import { useNavigate } from "react-router-dom";
import "./boquetsPage.css";

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

const BouquetsPage: React.FC = () => {
  const [bouquetInfo, setBouquetInfo] = useState<BouquetInfo[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>(0);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(0);
  const [flowerIds, setFlowerIds] = useState<number[] | undefined>([]);
  const { setSelectedFlowers } = useFlowers();
  const navigate = useNavigate();

  const selectedFlowers = [
    { flowerId: 1, quantity: 5 },
    { flowerId: 2, quantity: 3 },
  ];
  const handleCreateBouquetClick = () => {
    setSelectedFlowers(selectedFlowers); // Збережіть вибрані квіти в контекст
    navigate("/create-bouquet");
  };

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
    <div className="bouquet-page">
      <div>
        <BouquetsList bouquets={bouquetInfo} />
      </div>
      <button
        onClick={handleCreateBouquetClick}
        className="btn btn-primary position-absolute custom-button"
      >
        Create Bouquet
      </button>
    </div>
  );
};

export default BouquetsPage;
