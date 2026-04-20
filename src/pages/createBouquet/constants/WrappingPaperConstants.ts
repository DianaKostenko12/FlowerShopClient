import { SelectOption } from "./SelectOption";

export default class WrappingPaperConstants {
  static readonly CUSTOM_WRAPPING_COLOR_OPTION = "__custom_wrapping_color__";

  static readonly WRAPPING_TYPE_OPTIONS: SelectOption<number>[] = [
    { id: 0, label: "Папір" },
    { id: 1, label: "Крафт" },
    { id: 2, label: "Плівка" },
    { id: 3, label: "Сітка" },
    { id: 4, label: "Тканина" },
  ];

  static readonly WRAPPING_PATTERN_OPTIONS: SelectOption<number>[] = [
    { id: 0, label: "Звичайний" },
    { id: 1, label: "Лінії" },
    { id: 2, label: "Крапки" },
    { id: 3, label: "Без візерунку" },
  ];
}
