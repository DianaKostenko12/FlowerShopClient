export interface StyleOption {
  id: string;
  label: string;
  description: string;
}

const AI_BOUQUET_STYLE_OPTIONS: StyleOption[] = [
  { id: "Романтичний", label: "Романтичний", description: "Ніжні відтінки, троянди, м'які форми" },
  { id: "Класичний", label: "Класичний", description: "Витончений і збалансований" },
  { id: "Польовий", label: "Польовий", description: "Природний, дикий, з польовими квітами" },
  { id: "Мінімалістичний", label: "Мінімалістичний", description: "Лаконічний, сучасний стиль" },
  { id: "Розкішний", label: "Розкішний", description: "Пишний та вишуканий" },
  { id: "Вінтажний", label: "Вінтажний", description: "Ретро-настрій, пастельні тони" },
  { id: "Яскравий", label: "Яскравий", description: "Насичені кольори, виразний характер" },
  { id: "Пастельний", label: "Пастельний", description: "Ніжні пастельні відтінки" },
];

export default AI_BOUQUET_STYLE_OPTIONS;
