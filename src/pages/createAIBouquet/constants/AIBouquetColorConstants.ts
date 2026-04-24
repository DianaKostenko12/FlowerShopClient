export interface SelectOption {
  id: string;
  label: string;
}

export const CUSTOM_COLOR_OPTION = "__custom_color__";
export const CUSTOM_SHADE_OPTION = "__custom_shade__";

export const AI_BOUQUET_COLOR_OPTIONS: SelectOption[] = [
  { id: "червоний", label: "червоний" },
  { id: "рожевий", label: "рожевий" },
  { id: "білий", label: "білий" },
  { id: "жовтий", label: "жовтий" },
  { id: "помаранчевий", label: "помаранчевий" },
  { id: "фіолетовий", label: "фіолетовий" },
  { id: "синій", label: "синій" },
  { id: "блакитний", label: "блакитний" },
  { id: "зелений", label: "зелений" },
  { id: "бежевий", label: "бежевий" },
  { id: CUSTOM_COLOR_OPTION, label: "свій варіант" },
];

export const AI_BOUQUET_SHADE_OPTIONS: SelectOption[] = [
  { id: "ніжний", label: "ніжний" },
  { id: "пастельний", label: "пастельний" },
  { id: "насичений", label: "насичений" },
  { id: "яскравий", label: "яскравий" },
  { id: "темний", label: "темний" },
  { id: "світлий", label: "світлий" },
  { id: "теплий", label: "теплий" },
  { id: "холодний", label: "холодний" },
  { id: CUSTOM_SHADE_OPTION, label: "свій варіант" },
];
