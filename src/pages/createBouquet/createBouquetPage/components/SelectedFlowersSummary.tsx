import { FC, FormEvent } from "react";
import { Flower } from "../../types";
import BouquetFlowerRoleConstants from "../../constants/BouquetFlowerRoleConstants";
import classes from "../createBouquet.module.css";

interface SelectedFlowersSummaryProps {
  selectedFlowers: Flower[];
  totalPrice: number;
  error: string | null;
  onRemoveFlower: (flowerId: number, role: string) => void;
  onCreate: (e: FormEvent) => Promise<void>;
}

const SelectedFlowersSummary: FC<SelectedFlowersSummaryProps> = ({
  selectedFlowers,
  totalPrice,
  error,
  onRemoveFlower,
  onCreate,
}) => {
  const getRoleLabel = (role: string) =>
    BouquetFlowerRoleConstants.FLOWER_ROLE_OPTIONS.find(
      (roleOption) => roleOption.id === role
    )?.label ?? "Role";

  return (
    <div className={classes.summarySection}>
      <div className={classes.summaryHeader}>
        <h3 className={classes.summaryTitle}>Обрані квіти</h3>
      </div>

      {selectedFlowers.length > 0 ? (
        <div className={classes.summaryChips}>
          {selectedFlowers.map((flower) => (
            <span
              key={`${flower.id}-${flower.role}`}
              className={classes.summaryChip}
            >
              {flower.name}
              <span className={classes.summaryChipRole}>
                {getRoleLabel(flower.role)}
              </span>
              <span className={classes.summaryChipQuantity}>
                {flower.selectedQuantity}
              </span>
              <button
                className={classes.summaryChipRemove}
                onClick={() => onRemoveFlower(flower.id, flower.role)}
                title="Видалити"
              >
                x
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className={classes.emptySelection}>Ви ще не обрали жодної квітки</p>
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
};

export default SelectedFlowersSummary;
