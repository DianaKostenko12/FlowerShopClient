import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bouquetItem.css";
import MyModal from "../../../../UI/MyModal/MyModal";
import OrderModal from "../../../OrderModal";

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
  const [show, setShow] = useState(false);

  const handleClick = () => {
    navigate(`/bouquet/${bouquet.bouquetId}`);
  };

  return (
    <div className="bouquet-card card">
      <div className="card-body text-center">
        <h5 className="card-title">{bouquet.bouquetName}</h5>
        <div className="price-section">
          <span className="current-price">{bouquet.price} грн</span>
        </div>
        <button className="btn btn-primary mt-2" onClick={handleClick}>
          Детальніше
        </button>
      </div>
      <button className="btn-secondary" onClick={() => setShow(true)}>
        Додати до кошика
      </button>
      <OrderModal
        id={bouquet.bouquetId}
        name={bouquet.bouquetName}
        price={bouquet.price}
        show={show}
        handleClose={() => setShow(false)}
      />
    </div>
  );
};

export default BouquetItem;
