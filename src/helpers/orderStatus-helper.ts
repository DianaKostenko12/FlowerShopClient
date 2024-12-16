const getStatusText = (status: number): string => {
  switch (status) {
    case 1:
      return "В очікуванні";
    case 2:
      return "Підтверджено";
    case 3:
      return "Скасовано";
    default:
      return "Unknown";
  }
};
export { getStatusText };
