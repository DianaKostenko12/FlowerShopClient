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
    <div className={"row " + styles.bouquetsContainer}>
      {bouquets.map((bouquet) => (
        <div
          key={bouquet.bouquetId}
          className={"col-6 col-md-4 col-lg-3 col-xxl-2 " + styles.bouquetCard}
        >
          <BouquetItem bouquet={bouquet} />
        </div>
      ))}
    </div>
  );
};

export default BouquetsList;
