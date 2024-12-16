import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bouquetItem.css";
import OrderModal from "../../../OrderModal";
import { useAuth } from "../../../../common/AuthContext";
import BouquetService from "../../../../API/BouquetService";

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
  const { isAuthorized, userRole } = useAuth();

  const handleClick = () => {
    navigate(`/bouquet/${bouquet.bouquetId}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await BouquetService.deleteBouquet(id);
      console.log("Bouquet deleted successfully:", response);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete bouquet:", error);
    }
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
      {userRole !== "Admin" && (
        <button className="btn-secondary" onClick={() => setShow(true)}>
          Додати до кошика
        </button>
      )}
      {userRole === "Admin" && (
        <button
          className="btn btn-danger mt-2"
          onClick={() => handleDelete(bouquet.bouquetId)}
        >
          Видалити
        </button>
      )}
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
