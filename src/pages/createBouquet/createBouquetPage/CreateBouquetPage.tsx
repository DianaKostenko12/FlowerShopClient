import React, { FC, useEffect, useRef, useState } from "react";
import BouquetService from "../../../API/BouquetService";
import BouquetShapeConstants from "../constants/BouquetShapeConstants";
import WrappingPaperConstants from "../constants/WrappingPaperConstants";
import FlowerList from "../flower/FlowerList";
import { usePhotoUpload } from "../hooks/usePhotoUpload";
import { useSelectedFlowers } from "../hooks/useSelectedFlowers";
import { useWrappingPaperSelection } from "../hooks/useWrappingPaperSelection";
import PhotoUploadSection from "./components/PhotoUploadSection";
import SelectedFlowersSummary from "./components/SelectedFlowersSummary";
import classes from "./createBouquet.module.css";

const CreateBouquetPage: FC = () => {
  const [bouquetName, setBouquetName] = useState<string>("");
  const [bouquetDescription, setBouquetDescription] = useState<string>("");
  const [shape, setSelectedShape] = useState<string>();
  const [selectedFlowerRole, setSelectedFlowerRole] = useState<string>("Focal");
  const [error, setError] = useState<string | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const [formCardHeight, setFormCardHeight] = useState<number>();
  const {
    wrappingType,
    wrappingPattern,
    wrappingColorId,
    wrappingColorOptions,
    additionalWrappingColorOptions,
    isAddingWrappingColor,
    isWrappingLoading,
    selectedWrappingPaper,
    getWrappingPaperId,
    handleWrappingTypeChange,
    handleWrappingPatternChange,
    handleWrappingColorChange,
    handleAdditionalWrappingColorChange,
    handleDeleteWrappingPaper,
    resetWrappingPaperSelection,
  } = useWrappingPaperSelection(setError);
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
    const formCardElement = formCardRef.current;

    if (!formCardElement) {
      return;
    }

    const updateFormCardHeight = () => {
      if (window.innerWidth < 992) {
        setFormCardHeight(undefined);
        return;
      }

      setFormCardHeight(formCardElement.offsetHeight);
    };

    updateFormCardHeight();

    const resizeObserver = new ResizeObserver(updateFormCardHeight);
    resizeObserver.observe(formCardElement);
    window.addEventListener("resize", updateFormCardHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateFormCardHeight);
    };
  }, []);

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
      resetWrappingPaperSelection();
    } catch (error) {
      console.error("Failed to create a bouquet:", error);
      setError("Не вдалося створити букет. Спробуйте ще раз.");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className={classes.pageHeader}>
        <h2 className={classes.pageTitle}>Створення букета</h2>
        <p className={classes.pageSubtitle}>
          Оберіть квіти та налаштуйте ваш ідеальний букет
        </p>
      </div>

      <div className={`row ${classes.createBouquetLayout}`}>
        <div className="col-lg-4">
          <div ref={formCardRef} className={classes.formCard}>
            <div className={classes.formSection}>
              <div className={classes.formSectionTitle}>Основна інформація</div>
              <label className={classes.formLabel}>Назва букета</label>
              <input
                type="text"
                className={classes.formInput}
                value={bouquetName}
                onChange={(e) => setBouquetName(e.target.value)}
                placeholder="Введіть назву..."
              />

              <label className={classes.formLabel}>Опис букета</label>
              <textarea
                className={classes.formTextarea}
                value={bouquetDescription}
                onChange={(e) => setBouquetDescription(e.target.value)}
                placeholder="Опишіть ваш букет..."
              />
            </div>

            <div className={classes.formSection}>
              <div className={classes.formSectionTitle}>Параметри букета</div>
              <label className={classes.formLabel}>Форма букета</label>
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
                      ? WrappingPaperConstants.CUSTOM_WRAPPING_COLOR_OPTION
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
                    <option
                      value={WrappingPaperConstants.CUSTOM_WRAPPING_COLOR_OPTION}
                    >
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
                        handleAdditionalWrappingColorChange(e.target.value)
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
          <div
            className={classes.flowersPanel}
            style={
              formCardHeight ? { height: `${formCardHeight}px` } : undefined
            }
          >
            <FlowerList
              selectedFlowers={selectedFlowers}
              selectedRole={selectedFlowerRole}
              onSelectRole={setSelectedFlowerRole}
              onIncrementFlower={incrementFlower}
              onDecrementFlower={decrementFlower}
            />
          </div>
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
