import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BouquetAIGenerationService, {
  GenerateBouquetResponse,
} from "../../API/BouquetAIGenerationService";
import BouquetService, {
  CreateAIBouquetRequest,
} from "../../API/BouquetService";
import BouquetShapeConstants from "../createBouquet/constants/BouquetShapeConstants";
import {
  AI_BOUQUET_COLOR_OPTIONS,
  AI_BOUQUET_SHADE_OPTIONS,
  CUSTOM_COLOR_OPTION,
  CUSTOM_SHADE_OPTION,
} from "./constants/AIBouquetColorConstants";
import AI_BOUQUET_STYLE_OPTIONS from "./constants/AIBouquetStyleConstants";
import classes from "./createAIBouquet.module.css";

const CreateAIBouquetPage: FC = () => {
  const navigate = useNavigate();

  const [style, setStyle] = useState<string>("");
  const [shape, setShape] = useState<string>("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedShade, setSelectedShade] = useState<string>("");
  const [customColor, setCustomColor] = useState<string>("");
  const [customShade, setCustomShade] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [additionalComment, setAdditionalComment] = useState<string>("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateBouquetResponse | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const resolvedColors = selectedColors
    .map((color) =>
      color === CUSTOM_COLOR_OPTION ? customColor.trim() : color
    )
    .filter(Boolean);

  const resolvedShade =
    selectedShade === CUSTOM_SHADE_OPTION
      ? customShade.trim()
      : selectedShade;

  const validate = (): boolean => {
    if (!style) {
      setError("Оберіть стиль букета.");
      return false;
    }
    if (!shape) {
      setError("Оберіть форму букета.");
      return false;
    }
    if (selectedColors.length === 0) {
      setError("Оберіть хоча б один колір.");
      return false;
    }
    if (selectedColors.includes(CUSTOM_COLOR_OPTION) && !customColor.trim()) {
      setError("Введіть свій варіант кольору.");
      return false;
    }
    if (!selectedShade) {
      setError("Оберіть відтінок.");
      return false;
    }
    if (selectedShade === CUSTOM_SHADE_OPTION && !customShade.trim()) {
      setError("Введіть свій варіант відтінку.");
      return false;
    }
    const budgetNum = parseFloat(budget);
    if (!budget || isNaN(budgetNum) || budgetNum <= 0) {
      setError("Введіть коректний бюджет.");
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    setError(null);
    if (!validate()) return;

    setIsGenerating(true);
    try {
      const response = await BouquetAIGenerationService.generateAIBouquet({
        color: resolvedColors.map((color) => ({
          baseColor: color,
          shade: resolvedShade,
        })),
        budget: parseFloat(budget),
        style,
        shape,
        additionalComment,
      });

      setResult(response.data);
      setShowModal(true);
    } catch {
      setError("Не вдалося згенерувати букет. Спробуйте ще раз.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    setIsSaving(true);
    try {
      const request: CreateAIBouquetRequest = {
        BouquetName: result.bouquetInfo.bouquetName,
        BouquetDescription: result.bouquetInfo.bouquetDescription,
        WrappingPaperId: result.bouquetInfo.wrappingPaperId,
        Shape: result.bouquetInfo.shape,
        PhotoBytes: result.bouquetImage,
        PhotoContentType: "image/png",
        Flowers: result.bouquetInfo.bouquetComposition.map((item) => ({
          FlowerId: item.flowerId,
          FlowerCount: item.quantity,
          Role: item.flowerRole,
        })),
      };

      await BouquetService.saveAIBouquet(request);
      toast.success("Букет успішно збережено!");
      setShowModal(false);
      navigate("/bouquets");
    } catch {
      toast.error("Не вдалося зберегти букет.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    setShowModal(false);
    setResult(null);
    handleGenerate();
  };

  return (
    <div className="container py-4">
      <div className={classes.pageHeader}>
        <h2 className={classes.pageTitle}>Створити AI-букет</h2>
        <p className={classes.pageSubtitle}>
          Опишіть бажаний букет, а AI підбере квіти та оформлення.
        </p>
      </div>

      <div className={classes.formCard}>
        <div className={classes.formSection}>
          <div className={classes.formSectionTitle}>Стиль букета</div>
          <div className={classes.styleGrid}>
            {AI_BOUQUET_STYLE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${classes.styleCard} ${style === option.id ? classes.styleCardActive : ""}`}
                onClick={() => setStyle(option.id)}
              >
                <span className={classes.styleCardLabel}>{option.label}</span>
                <span className={classes.styleCardDesc}>
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={classes.formSection}>
          <div className={classes.formSectionTitle}>Форма букета</div>
          <div className={classes.chipRow}>
            {BouquetShapeConstants.BOUQUET_SHAPE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${classes.chip} ${shape === option.id ? classes.chipActive : ""}`}
                onClick={() => setShape(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={classes.formSection}>
          <div className={classes.formSectionTitle}>Кольори</div>
          <div className={classes.chipRow}>
            {AI_BOUQUET_COLOR_OPTIONS.map((color) => (
              <button
                key={color.id}
                type="button"
                className={`${classes.chip} ${selectedColors.includes(color.id) ? classes.chipActive : ""}`}
                onClick={() => toggleColor(color.id)}
              >
                {color.label}
              </button>
            ))}
          </div>
          {selectedColors.includes(CUSTOM_COLOR_OPTION) && (
            <input
              type="text"
              className={classes.formInput}
              placeholder="Введіть свій колір"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
            />
          )}
        </div>

        <div className={classes.formSection}>
          <div className={classes.formSectionTitle}>Відтінок</div>
          <div className={classes.chipRow}>
            {AI_BOUQUET_SHADE_OPTIONS.map((shade) => (
              <button
                key={shade.id}
                type="button"
                className={`${classes.chip} ${selectedShade === shade.id ? classes.chipActive : ""}`}
                onClick={() => setSelectedShade(shade.id)}
              >
                {shade.label}
              </button>
            ))}
          </div>
          {selectedShade === CUSTOM_SHADE_OPTION && (
            <input
              type="text"
              className={classes.formInput}
              placeholder="Введіть свій відтінок"
              value={customShade}
              onChange={(e) => setCustomShade(e.target.value)}
            />
          )}
        </div>

        <div className={classes.formSection}>
          <div className={classes.formSectionTitle}>Бюджет</div>
          <div className={classes.budgetRow}>
            <input
              type="number"
              className={classes.formInput}
              placeholder="Наприклад, 800"
              value={budget}
              min={1}
              onChange={(e) => setBudget(e.target.value)}
            />
            <span className={classes.currencyLabel}>грн</span>
          </div>
        </div>

        <div className={classes.formSection}>
          <div className={classes.formSectionTitle}>
            Додатковий коментар{" "}
            <span className={classes.optional}>(необов'язково)</span>
          </div>
          <textarea
            className={classes.formTextarea}
            placeholder="Наприклад: для дня народження мами, хочу щось ніжне..."
            value={additionalComment}
            onChange={(e) => setAdditionalComment(e.target.value)}
            rows={3}
          />
        </div>

        {error && <div className={classes.error}>{error}</div>}

        <button
          className={classes.generateButton}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <span className={classes.loadingText}>
              <span className={classes.spinner} /> Генерую букет...
            </span>
          ) : (
            "✨ Згенерувати букет"
          )}
        </button>
      </div>

      {showModal && result && (
        <div
          className={classes.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <h3 className={classes.modalTitle}>
                {result.bouquetInfo.bouquetName}
              </h3>
            </div>

            <div className={classes.modalBody}>
              <div className={classes.modalImageWrap}>
                <img
                  src={`data:image/png;base64,${result.bouquetImage}`}
                  alt="Згенерований букет"
                  className={classes.modalImage}
                />
              </div>

              <div className={classes.modalDetails}>
                <div className={classes.detailRow}>
                  <span className={classes.detailLabel}>Форма:</span>
                  <span className={classes.detailValue}>
                    {result.bouquetInfo.shape}
                  </span>
                </div>

                {result.bouquetInfo.bouquetDescription && (
                  <div className={classes.detailRow}>
                    <span className={classes.detailLabel}>Опис:</span>
                    <span className={classes.detailValue}>
                      {result.bouquetInfo.bouquetDescription}
                    </span>
                  </div>
                )}

              </div>
            </div>

            <div className={classes.modalFooter}>
              <button
                className={classes.regenerateButton}
                onClick={handleRegenerate}
                disabled={isGenerating || isSaving}
              >
                {isGenerating ? "Генерую..." : "Перегенерувати"}
              </button>
              <button
                className={classes.saveButton}
                onClick={handleSave}
                disabled={isSaving || isGenerating}
              >
                {isSaving ? "Зберігаю..." : "Подобається — зберегти"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAIBouquetPage;
