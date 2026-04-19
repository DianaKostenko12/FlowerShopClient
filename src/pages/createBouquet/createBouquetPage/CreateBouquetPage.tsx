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

const CUSTOM_WRAPPING_COLOR_OPTION = "__custom_wrapping_color__";

const CreateBouquetPage: FC = () => {
  const [bouquetName, setBouquetName] = useState<string>("");
  const [bouquetDescription, setBouquetDescription] = useState<string>("");
  const [shape, setSelectedShape] = useState<string>();
  const [wrappingPapers, setWrappingPapers] = useState<WrappingPaperInfo[]>([]);
  const [wrappingType, setWrappingType] = useState<number>();
  const [wrappingPattern, setWrappingPattern] = useState<number>();
  const [wrappingColorId, setWrappingColorId] = useState<number>();
  const [isAddingWrappingColor, setIsAddingWrappingColor] = useState(false);
  const [isWrappingLoading, setIsWrappingLoading] = useState(false);
  const [selectedFlowerRole, setSelectedFlowerRole] = useState<string>("Focal");
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

  const wrappingColorOptions = useMemo<SelectOption<number>[]>(() => {
    if (wrappingType === undefined || wrappingPattern === undefined) {
      return [];
    }

    const colorsById = new Map<number, string>();

    wrappingPapers.forEach((paper) => {
      if (
        paper.type === wrappingType &&
        paper.pattern === wrappingPattern &&
        paper.colorName
      ) {
        colorsById.set(paper.colorId, paper.colorName);
      }
    });

    return Array.from(colorsById.entries())
      .sort(([, firstColorName], [, secondColorName]) =>
        firstColorName.localeCompare(secondColorName)
      )
      .map(([colorId, colorName]) => ({
        id: colorId,
        label: colorName,
      }));
  }, [wrappingPapers, wrappingPattern, wrappingType]);

  const allWrappingColorOptions = useMemo<SelectOption<number>[]>(() => {
    const colorsById = new Map<number, string>();

    wrappingPapers.forEach((paper) => {
      if (paper.colorName) {
        colorsById.set(paper.colorId, paper.colorName);
      }
    });

    return Array.from(colorsById.entries())
      .sort(([, firstColorName], [, secondColorName]) =>
        firstColorName.localeCompare(secondColorName)
      )
      .map(([colorId, colorName]) => ({
        id: colorId,
        label: colorName,
      }));
  }, [wrappingPapers]);

  const additionalWrappingColorOptions = useMemo(() => {
    const selectedColorIds = new Set(
      wrappingColorOptions.map((option) => option.id)
    );

    return allWrappingColorOptions.filter(
      (option) => !selectedColorIds.has(option.id)
    );
  }, [allWrappingColorOptions, wrappingColorOptions]);

  const selectedWrappingPaper = useMemo(
    () =>
      wrappingPapers.find(
        (paper) =>
          paper.type === wrappingType &&
          paper.pattern === wrappingPattern &&
          paper.colorId === wrappingColorId
      ),
    [wrappingPapers, wrappingColorId, wrappingPattern, wrappingType]
  );

  const getWrappingPaperId = async (): Promise<number | undefined> => {
    if (selectedWrappingPaper) {
      return selectedWrappingPaper.wrappingPaperId;
    }

    if (
      wrappingType === undefined ||
      wrappingPattern === undefined ||
      wrappingColorId === undefined
    ) {
      setError("Оберіть тип, патерн та колір обгорткового паперу.");
      return undefined;
    }

    const response = await WrappingService.addWrappingPaper({
      type: wrappingType,
      colorId: wrappingColorId,
      pattern: wrappingPattern,
    });

    const newWrappingPaper = response.data;
    setWrappingPapers((currentWrappingPapers) => [
      ...currentWrappingPapers,
      newWrappingPaper,
    ]);

    return newWrappingPaper.wrappingPaperId;
  };

  const handleWrappingTypeChange = (value: string) => {
    setWrappingType(parseSelectNumber(value));
    setWrappingColorId(undefined);
    setIsAddingWrappingColor(false);
  };

  const handleWrappingPatternChange = (value: string) => {
    setWrappingPattern(parseSelectNumber(value));
    setWrappingColorId(undefined);
    setIsAddingWrappingColor(false);
  };

  const handleWrappingColorChange = (value: string) => {
    if (value === CUSTOM_WRAPPING_COLOR_OPTION) {
      setIsAddingWrappingColor(true);
      setWrappingColorId(undefined);
      return;
    }

    setIsAddingWrappingColor(false);
    setWrappingColorId(parseSelectNumber(value));
  };

  const handleDeleteWrappingPaper = async () => {
    if (!selectedWrappingPaper) {
      setError("Оберіть обгортковий папір, який потрібно зробити недоступним.");
      return;
    }

    try {
      await WrappingService.deleteWrappingPaper(
        selectedWrappingPaper.wrappingPaperId
      );
      setWrappingPapers((currentWrappingPapers) =>
        currentWrappingPapers.filter(
          (paper) =>
            paper.wrappingPaperId !== selectedWrappingPaper.wrappingPaperId
        )
      );
      setWrappingColorId(undefined);
      setIsAddingWrappingColor(false);
    } catch (error) {
      console.error("Failed to delete wrapping paper:", error);
      setError("Не вдалося зробити обрану обгортку недоступною.");
    }
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
      wrappingColorId === undefined
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
      console.error("Failed to prepare the selected wrapping paper:", error);
      setError("Не вдалося підготувати обрану обгортку. Спробуйте ще раз.");
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
        role: flower.role,
      })),
    };

    try {
      console.log(bouquetToCreate);
      const response = await BouquetService.createBouquet(bouquetToCreate);
      console.log("Bouquet created successfully:", response.data);

      setBouquetName("");
      setBouquetDescription("");
      resetPhoto();
      resetSelectedFlowers();
      setSelectedShape(undefined);
      setWrappingType(undefined);
      setWrappingPattern(undefined);
      setWrappingColorId(undefined);
      setIsAddingWrappingColor(false);
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
                  onChange={(e) => handleWrappingTypeChange(e.target.value)}
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
                  onChange={(e) => handleWrappingPatternChange(e.target.value)}
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
                  value={
                    isAddingWrappingColor
                      ? CUSTOM_WRAPPING_COLOR_OPTION
                      : wrappingColorId ?? ""
                  }
                  onChange={(e) => handleWrappingColorChange(e.target.value)}
                  disabled={
                    isWrappingLoading ||
                    wrappingType === undefined ||
                    wrappingPattern === undefined
                  }
                >
                  <option value="">Оберіть колір</option>
                  {wrappingColorOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                  {additionalWrappingColorOptions.length > 0 && (
                    <option value={CUSTOM_WRAPPING_COLOR_OPTION}>
                      Інший колір...
                    </option>
                  )}
                </select>
              </div>

              {isAddingWrappingColor && (
                <>
                  <label className={classes.formLabel}>
                    Колір для цієї обгортки
                  </label>
                  <div className={classes.dropdownWrapper}>
                    <select
                      className={classes.formInput}
                      value={wrappingColorId ?? ""}
                      onChange={(e) =>
                        setWrappingColorId(parseSelectNumber(e.target.value))
                      }
                      disabled={isWrappingLoading}
                    >
                      <option value="">Оберіть існуючий колір</option>
                      {additionalWrappingColorOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {selectedWrappingPaper && (
                <button
                  type="button"
                  className={classes.secondaryButton}
                  onClick={handleDeleteWrappingPaper}
                  disabled={isWrappingLoading}
                >
                  Зробити обгортку недоступною
                </button>
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
            selectedRole={selectedFlowerRole}
            onSelectRole={setSelectedFlowerRole}
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
