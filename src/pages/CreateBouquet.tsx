import React, { FC, useState } from "react";
import { Bouquet } from "../components/bouquet/bouquetItem/BouquetItem";
import UserService from "../API/UserService";
import BouquetService from "../API/BouquetService";
import { useFlowers } from "../common/FlowerContext";

const CreateBouquet: FC = () => {
  const [bouquetName, setBouquetName] = useState<string>("");
  const [bouquetDescription, setBouquetDescription] = useState<string>("");
  const { selectedFlowers } = useFlowers();

  const handleCreateBouquet = async (e: React.FormEvent): Promise<void> => {
    const bouquetToCreate = {
      bouquetName,
      bouquetDescription,
      flowers: selectedFlowers,
    };

    console.log("Creating Bouquet:", bouquetToCreate);

    try {
      const response = await BouquetService.createBouquet(bouquetToCreate);
      console.log("Bouquet created successfully:", response.data);

      setBouquetName("");
      setBouquetDescription("");
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };

  return (
    <div>
      <div>
        <h2>Create Bouquet</h2>
        <input
          type="text"
          placeholder="Bouquet Name"
          value={bouquetName}
          onChange={(e) => setBouquetName(e.target.value)}
        />
        <textarea
          placeholder="Bouquet Description"
          value={bouquetDescription}
          onChange={(e) => setBouquetDescription(e.target.value)}
        ></textarea>
        <button onClick={handleCreateBouquet}>Create Bouquet</button>
      </div>
    </div>
  );
};

export default CreateBouquet;
