import React, { createContext, ReactNode, useContext, useState } from "react";
interface SelectedFlower {
  flowerId: number;
  quantity: number;
}

// Тип даних контексту
interface FlowerContextType {
  selectedFlowers: SelectedFlower[];
  setSelectedFlowers: React.Dispatch<React.SetStateAction<SelectedFlower[]>>;
}
const FlowerContext = createContext<FlowerContextType | undefined>(undefined);
interface FlowerProviderProps {
  children: ReactNode;
}

export const FlowerProvider: React.FC<FlowerProviderProps> = ({ children }) => {
  const [selectedFlowers, setSelectedFlowers] = useState<SelectedFlower[]>([]);

  return (
    <FlowerContext.Provider value={{ selectedFlowers, setSelectedFlowers }}>
      {children}
    </FlowerContext.Provider>
  );
};

export const useFlowers = (): FlowerContextType => {
  const context = useContext(FlowerContext);
  if (!context) {
    throw new Error("useFlowers must be used within a FlowerProvider");
  }
  return context;
};
