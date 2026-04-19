import React, { useState, useEffect } from "react";
import FlowerItem from "./FlowerItem";
import FlowerService from "../../../API/FlowerService";
import classes from "./flowerList.module.css";
import { Flower } from "../types";
import BouquetFlowerRoleConstants from "../constants/BouquetFlowerRoleConstants";

interface FlowerListProps {
  selectedFlowers: Flower[];
  selectedRole: string;
  onSelectRole: (role: string) => void;
  onIncrementFlower: (flower: Flower, role: string) => void;
  onDecrementFlower: (flower: Flower, role: string) => void;
}

const FlowerList: React.FC<FlowerListProps> = ({
  selectedFlowers,
  selectedRole,
  onSelectRole,
  onIncrementFlower,
  onDecrementFlower,
}) => {
  const [availableFlowers, setAvailableFlowers] = useState<Flower[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initialFlowers = async () => {
      try {
        const response = await FlowerService.getFlowers();
        const flowers: Flower[] = response.data.map((flower) => ({
          ...flower,
          id: flower.flowerId,
          name: flower.flowerName,
          cost: flower.flowerCost,
          photo: flower.imgUrl,
          availableQuantity: flower.flowerCount,
          selectedQuantity: 0,
          role: "Focal",
        }));

        setAvailableFlowers(flowers);
      } catch (error) {
        console.error("Error fetching flowers:", error);
      }
    };
    initialFlowers();
  }, []);

  const filteredFlowers = availableFlowers.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className={classes.listHeader}>
        <h3 className={classes.listTitle}>Оберіть квіти</h3>
        <span className={classes.listCount}>
          {availableFlowers.length} доступно
        </span>
      </div>

      <div className={classes.roleTabs}>
        {BouquetFlowerRoleConstants.FLOWER_ROLE_OPTIONS.map((roleOption) => (
          <button
            key={roleOption.id}
            type="button"
            className={`${classes.roleTab} ${
              selectedRole === roleOption.id ? classes.roleTabActive : ""
            }`}
            onClick={() => onSelectRole(roleOption.id)}
          >
            {roleOption.label}
          </button>
        ))}
      </div>

      <div className={classes.searchWrapper}>
        <span className={classes.searchIcon}>&#128269;</span>
        <input
          type="text"
          className={classes.searchInput}
          placeholder="Пошук квітів..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={classes.flowerGridWrapper}>
        <div className={`row ${classes.flowerGrid}`}>
          {filteredFlowers.length > 0 ? (
            filteredFlowers.map((flower) => (
              <div key={flower.id} className="col-6 col-sm-4 col-xl-3">
                <FlowerItem
                  flower={flower}
                  selectedFlowers={selectedFlowers}
                  selectedRole={selectedRole}
                  onIncrementFlower={onIncrementFlower}
                  onDecrementFlower={onDecrementFlower}
                />
              </div>
            ))
          ) : (
            <div className={classes.emptyState}>
              {searchTerm
                ? "Квітів за вашим запитом не знайдено"
                : "Завантаження квітів..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowerList;
