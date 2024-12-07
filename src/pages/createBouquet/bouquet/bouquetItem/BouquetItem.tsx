import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import "./bouquetItem.css";

export interface Bouquet {
  bouquetId: number;
  bouquetName: string;
  price: number;
}

interface BouquetItemProps {
  bouquet: Bouquet;
}

const BouquetItem: FC<BouquetItemProps> = ({ bouquet }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/bouquet/${bouquet.bouquetId}`);
  };

  return (
    <div className="bouquet-card card" onClick={handleClick}>
      <div className="card-body text-center">
        <h5 className="card-title">{bouquet.bouquetName}</h5>
        <div className="price-section">
          <span className="current-price">{bouquet.price} грн</span>
        </div>
        <button className="btn btn-primary mt-2">Детальніше</button>
      </div>
    </div>
  );
};

export default BouquetItem;
