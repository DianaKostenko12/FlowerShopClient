import { SelectOption } from "./SelectOption";

export default class BouquetFlowerRoleConstants {
  static readonly FLOWER_ROLE_OPTIONS: SelectOption<string>[] = [
    { id: "Focal", label: "Акцентні" },
    { id: "Filler", label: "Наповнювачі" },
    { id: "Semi", label: "Напівакцентні" },
    { id: "Greenery", label: "Зелень" },
  ];
}
