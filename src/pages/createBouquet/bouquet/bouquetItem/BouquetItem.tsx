import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderModal from "../../../OrderModal";
import { useAuth } from "../../../../common/AuthContext";
import BouquetService from "../../../../API/BouquetService";
import styles from "./bouquetItem.module.css"; // Імпорт CSS-модулів

export interface Bouquet {
  bouquetId: number;
  bouquetName: string;
  photoFileName: string;
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
    <div className={styles.bouquetCard}>
      <div className={styles.bouquetImg}>
        <img
          src={bouquet.photoFileName}
          alt={bouquet.bouquetName}
          className={styles.image}
        />
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardTitle}>{bouquet.bouquetName}</p>
        <p className={styles.currentPrice}>{bouquet.price} грн</p>
        <div className={styles.cardButtons}>
          <button className={styles.btnPrimary} onClick={handleClick}>
            Детальніше
          </button>
          {userRole === "Admin" ? (
            <button
              className={`${styles.btnPrimary} ${styles.btnDanger}`}
              onClick={() => handleDelete(bouquet.bouquetId)}
            >
              Видалити
            </button>
          ) : (
            <button
              className={styles.btnSecondary}
              onClick={() => setShow(true)}
            >
              Додати до кошика
            </button>
          )}
        </div>
      </div>
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
