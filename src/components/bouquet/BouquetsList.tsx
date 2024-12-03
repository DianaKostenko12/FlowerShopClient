import { Bouquet } from "./bouquetItem/BouquetItem";
import BouquetItem from "./bouquetItem/BouquetItem"; // Імпорт компонента BouquetItem
import { FC } from "react";

interface BouquetListProps {
  bouquets: Bouquet[];
}

const BouquetsList: FC<BouquetListProps> = ({ bouquets }) => {
  if (!bouquets.length) {
    return <h1>Букети не знайдені</h1>;
  }

  return (
    <div className="row g-3">
      {bouquets.map((bouquet, index) => (
        <div key={bouquet.bouquetId} className="post col-4">
          <BouquetItem bouquet={bouquet} />
        </div>
      ))}
    </div>
  );
};

export default BouquetsList;
