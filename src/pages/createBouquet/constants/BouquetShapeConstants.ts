import { SelectOption } from "./SelectOption";

export default class BouquetShapeConstants {
  static readonly BOUQUET_SHAPE_OPTIONS: SelectOption<string>[] = [
    { id: "кругла", label: "Кругла" },
    { id: "подовжена", label: "Подовжена" },
    { id: "асиметрична", label: "Асиметрична" },
  ];
}
