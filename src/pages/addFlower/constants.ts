import { StemType } from "../../API/FlowerService";

export const CUSTOM_COLOR_OPTION = "__custom_color__";
export const CUSTOM_CATEGORY_OPTION = "__custom_category__";
export const CUSTOM_SHADE_OPTION = "__custom_shade__";

export const STEM_TYPE_LABELS: Record<StemType, string> = {
  [StemType.Soft]: "М'яке",
  [StemType.Standard]: "Стандартне",
  [StemType.Woody]: "Дерев'янисте",
  [StemType.Succulent]: "Сукулентне",
};
