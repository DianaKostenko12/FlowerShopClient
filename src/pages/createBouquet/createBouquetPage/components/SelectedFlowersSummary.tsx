import { FC, FormEvent } from "react";
import { Flower } from "../../types";
import classes from "../createBouquet.module.css";

interface SelectedFlowersSummaryProps {
  selectedFlowers: Flower[];
  totalPrice: number;
  error: string | null;
  onRemoveFlower: (flowerId: number) => void;
  onCreate: (e: FormEvent) => Promise<void>;
}

const SelectedFlowersSummary: FC<SelectedFlowersSummaryProps> = ({
  selectedFlowers,
  totalPrice,
  error,
  onRemoveFlower,
  onCreate,
}) => (
  <div className={classes.summarySection}>
    <div className={classes.summaryHeader}>
      <h3 className={classes.summaryTitle}>Обрані квіти</h3>
    </div>

    {selectedFlowers.length > 0 ? (
      <div className={classes.summaryChips}>
        {selectedFlowers.map((flower) => (
          <span key={flower.id} className={classes.summaryChip}>
            {flower.name}
            <span className={classes.summaryChipQuantity}>
              {flower.selectedQuantity}
            </span>
            <button
              className={classes.summaryChipRemove}
              onClick={() => onRemoveFlower(flower.id)}
              title="Видалити"
            >
              x
            </button>
          </span>
        ))}
      </div>
    ) : (
      <p className={classes.emptySelection}>
        Ви ще не обрали жодної квітки
      </p>
    )}

    {error && <p className={classes.error}>{error}</p>}

    <div className={classes.summaryFooter}>
      <div className={classes.totalPrice}>
        <span className={classes.totalPriceLabel}>Загальна вартість: </span>
        {totalPrice} грн
      </div>
      <button onClick={onCreate} className={classes.createButton}>
        Створити букет
      </button>
    </div>
  </div>
);

export default SelectedFlowersSummary;
