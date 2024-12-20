import BouquetItem from "../bouquetItem/BouquetItem";
import styles from "./bouquetList.module.css";
import { FC } from "react";
import { Bouquet } from "../bouquetItem/BouquetItem";

interface BouquetListProps {
  bouquets: Bouquet[];
}

const BouquetsList: FC<BouquetListProps> = ({ bouquets }) => {
  if (!bouquets.length) {
    return <h1 className={styles.noBouquets}>Букети не знайдені</h1>;
  }

  return (
    <div className={styles.bouquetsContainer}>
      {bouquets.map((bouquet) => (
        <div key={bouquet.bouquetId} className={styles.bouquetCard}>
          <BouquetItem bouquet={bouquet} />
        </div>
      ))}
    </div>
  );
};

export default BouquetsList;
