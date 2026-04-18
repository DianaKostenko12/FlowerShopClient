import React, { FC, useEffect, useMemo, useState } from "react";
import BouquetService from "../../../API/BouquetService";
import WrappingService, {
  WrappingPaperInfo,
} from "../../../API/WrappingService";
import BouquetShapeConstants from "../constants/BouquetShapeConstants";
import { SelectOption } from "../constants/SelectOption";
import WrappingPaperConstants from "../constants/WrappingPaperConstants";
import FlowerList from "../flower/FlowerList";
import { usePhotoUpload } from "../hooks/usePhotoUpload";
import { useSelectedFlowers } from "../hooks/useSelectedFlowers";
import PhotoUploadSection from "./components/PhotoUploadSection";
import SelectedFlowersSummary from "./components/SelectedFlowersSummary";
import classes from "./createBouquet.module.css";

const parseSelectNumber = (value: string): number | undefined =>
  value === "" ? undefined : Number(value);

const CreateBouquetPage: FC = () => {
  const [bouquetName, setBouquetName] = useState<string>("");
  const [bouquetDescription, setBouquetDescription] = useState<string>("");
  const [shape, setSelectedShape] = useState<string>();
  const [wrappingPapers, setWrappingPapers] = useState<WrappingPaperInfo[]>([]);
  const [wrappingType, setWrappingType] = useState<number>();
  const [wrappingPattern, setWrappingPattern] = useState<number>();
  const [wrappingColorName, setWrappingColorName] = useState<string>();
  const [isWrappingLoading, setIsWrappingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    selectedFlowers,
    incrementFlower,
    decrementFlower,
    removeFlower,
    resetSelectedFlowers,
    totalPrice,
  } = useSelectedFlowers();
  const {
    photo,
    photoPreviewUrl,
    isDragging,
    fileInputRef,
    handlePhotoChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetPhoto,
  } = usePhotoUpload();

  useEffect(() => {
    const loadWrappingPapers = async () => {
      setIsWrappingLoading(true);

      try {
        const response = await WrappingService.getWrappingPapers();
        setWrappingPapers(response.data);
      } catch (error) {
        console.error("Failed to load wrapping papers:", error);
        setError("Не вдалося завантажити обгортковий папір.");
      } finally {
        setIsWrappingLoading(false);
      }
    };

    loadWrappingPapers();
  }, []);

  const wrappingColorOptions = useMemo<SelectOption<string>[]>(() => {
    const colorNames = new Set<string>();

    wrappingPapers.forEach((paper) => {
      if (paper.colorName) {
        colorNames.add(paper.colorName);
      }
    });

    return Array.from(colorNames)
      .sort((firstColorName, secondColorName) =>
        firstColorName.localeCompare(secondColorName)
      )
      .map((colorName) => ({
        id: colorName,
        label: colorName,
      }));
  }, [wrappingPapers]);

  const selectedWrappingPaper = useMemo(
    () =>
      wrappingPapers.find(
        (paper) =>
          paper.type === wrappingType &&
          paper.pattern === wrappingPattern &&
          paper.colorName === wrappingColorName
      ),
    [wrappingPapers, wrappingColorName, wrappingPattern, wrappingType]
  );

  const selectedWrappingColorId = useMemo(
    () =>
      wrappingPapers.find(
        (paper) =>
          paper.colorName === wrappingColorName &&
          typeof paper.colorId === "number"
      )?.colorId,
    [wrappingPapers, wrappingColorName]
  );

  const getWrappingPaperId = async (): Promise<number | undefined> => {
    if (selectedWrappingPaper) {
      return selectedWrappingPaper.wrappingPaperId;
    }

    if (
      wrappingType === undefined ||
      wrappingPattern === undefined ||
      wrappingColorName === undefined
    ) {
      setError("Оберіть тип, патерн та колір обгорткового паперу.");
      return undefined;
    }

    if (selectedWrappingColorId === undefined) {
      setError("Не вдалося визначити колір обгорткового паперу.");
      return undefined;
    }

    const response = await WrappingService.addWrappingPaper({
      type: wrappingType,
      colorId: selectedWrappingColorId,
      pattern: wrappingPattern,
    });

    const newWrappingPaper = response.data;
    setWrappingPapers((currentWrappingPapers) => [
      ...currentWrappingPapers,
      newWrappingPaper,
    ]);

    return newWrappingPaper.wrappingPaperId;
  };

  const handleCreate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!photo) {
      setError("Будь ласка, оберіть фото для букета.");
      return;
    }

    if (!shape) {
      setError("Оберіть форму букета.");
      return;
    }

    if (
      wrappingType === undefined ||
      wrappingPattern === undefined ||
      wrappingColorName === undefined
    ) {
      setError(
        "Оберіть доступну комбінацію типу, патерну та кольору для обгорткового паперу."
      );
      return;
    }

    let wrappingPaperId: number;

    try {
      const resolvedWrappingPaperId = await getWrappingPaperId();

      if (resolvedWrappingPaperId === undefined) {
        return;
      }

      wrappingPaperId = resolvedWrappingPaperId;
    } catch (error) {
      console.error("Failed to create a wrapping paper:", error);
      setError("Не вдалося створити обгортковий папір. Спробуйте ще раз.");
      return;
    }

    const bouquetToCreate = {
      bouquetName,
      bouquetDescription,
      photo,
      wrappingPaperId,
      shape,
      flowers: selectedFlowers.map((flower) => ({
        flowerId: flower.id,
        flowerCount: flower.selectedQuantity,
        role: 0,
      })),
    };

    try {
      const response = await BouquetService.createBouquet(bouquetToCreate);
      console.log("Bouquet created successfully:", response.data);

      setBouquetName("");
      setBouquetDescription("");
      resetPhoto();
      resetSelectedFlowers();
      setSelectedShape(undefined);
      setWrappingType(undefined);
      setWrappingPattern(undefined);
      setWrappingColorName(undefined);
    } catch (error) {
      console.error("Failed to create a bouquet:", error);
      setError("Не вдалося створити букет. Спробуйте ще раз.");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className={classes.pageHeader}>
        <h2 className={classes.pageTitle}>Створення букету</h2>
        <p className={classes.pageSubtitle}>
          Оберіть квіти та налаштуйте ваш ідеальний букет
        </p>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className={classes.formCard}>
            <div className={classes.formSection}>
              <div className={classes.formSectionTitle}>Основна інформація</div>
              <label className={classes.formLabel}>Назва букету</label>
              <input
                type="text"
                className={classes.formInput}
                value={bouquetName}
                onChange={(e) => setBouquetName(e.target.value)}
                placeholder="Введіть назву..."
              />

              <label className={classes.formLabel}>Опис букету</label>
              <textarea
                className={classes.formTextarea}
                value={bouquetDescription}
                onChange={(e) => setBouquetDescription(e.target.value)}
                placeholder="Опишіть ваш букет..."
              />
            </div>

            <div className={classes.formSection}>
              <div className={classes.formSectionTitle}>Параметри букету</div>
              <label className={classes.formLabel}>Форма букету</label>
              <div className={classes.dropdownWrapper}>
                <select
                  className={classes.formInput}
                  value={shape ?? ""}
                  onChange={(e) => setSelectedShape(e.target.value)}
                >
                  <option value="">Оберіть форму</option>
                  {BouquetShapeConstants.BOUQUET_SHAPE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className={classes.formLabel}>
                Тип обгорткового паперу
              </label>
              <div className={classes.dropdownWrapper}>
                <select
                  className={classes.formInput}
                  value={wrappingType ?? ""}
                  onChange={(e) =>
                    setWrappingType(parseSelectNumber(e.target.value))
                  }
                  disabled={isWrappingLoading}
                >
                  <option value="">Оберіть тип</option>
                  {WrappingPaperConstants.WRAPPING_TYPE_OPTIONS.map(
                    (option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <label className={classes.formLabel}>
                Патерн обгорткового паперу
              </label>
              <div className={classes.dropdownWrapper}>
                <select
                  className={classes.formInput}
                  value={wrappingPattern ?? ""}
                  onChange={(e) =>
                    setWrappingPattern(parseSelectNumber(e.target.value))
                  }
                  disabled={isWrappingLoading}
                >
                  <option value="">Оберіть патерн</option>
                  {WrappingPaperConstants.WRAPPING_PATTERN_OPTIONS.map(
                    (option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <label className={classes.formLabel}>
                Колір обгорткового паперу
              </label>
              <div className={classes.dropdownWrapper}>
                <select
                  className={classes.formInput}
                  value={wrappingColorName ?? ""}
                  onChange={(e) =>
                    setWrappingColorName(e.target.value || undefined)
                  }
                  disabled={
                    isWrappingLoading || wrappingColorOptions.length === 0
                  }
                >
                  <option value="">Оберіть колір</option>
                  {wrappingColorOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {wrappingType !== undefined &&
                wrappingPattern !== undefined &&
                wrappingColorName !== undefined &&
                !selectedWrappingPaper && (
                  <p className={classes.fieldHint}>
                    Такої комбінації обгорткового паперу ще немає, вона буде
                    створена автоматично.
                  </p>
                )}
            </div>

            <PhotoUploadSection
              photo={photo}
              photoPreviewUrl={photoPreviewUrl}
              isDragging={isDragging}
              fileInputRef={fileInputRef}
              onPhotoChange={handlePhotoChange}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          </div>
        </div>

        <div className="col-lg-8">
          <FlowerList
            selectedFlowers={selectedFlowers}
            onIncrementFlower={incrementFlower}
            onDecrementFlower={decrementFlower}
          />
        </div>
      </div>

      <SelectedFlowersSummary
        selectedFlowers={selectedFlowers}
        totalPrice={totalPrice}
        error={error}
        onRemoveFlower={removeFlower}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default CreateBouquetPage;
