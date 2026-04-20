import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BouquetService, {
  BouquetDetails,
  GenerateBouquetResponse,
} from "../../API/BouquetService";
import BouquetShapeConstants from "../createBouquet/constants/BouquetShapeConstants";
import WrappingPaperConstants from "../createBouquet/constants/WrappingPaperConstants";
import AI_BOUQUET_STYLE_OPTIONS from "./constants/AIBouquetStyleConstants";
import classes from "./createAIBouquet.module.css";

const FLOWER_COLORS = [
  "червоний",
  "рожевий",
  "білий",
  "жовтий",
  "помаранчевий",
  "фіолетовий",
  "синій",
  "блакитний",
  "зелений",
  "бежевий",
];

const CreateAIBouquetPage: FC = () => {
  const navigate = useNavigate();

  const [style, setStyle] = useState<string>("");
  const [shape, setShape] = useState<string>("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
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
      const response = await BouquetService.generateAIBouquet({
        color: selectedColors,
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
      await BouquetService.saveAIBouquet(result.bouquetDetails);
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

  const getWrappingTypeLabel = (type: number) =>
    WrappingPaperConstants.WRAPPING_TYPE_OPTIONS.find((o) => o.id === type)
      ?.label ?? type;

  const getWrappingPatternLabel = (pattern: number) =>
    WrappingPaperConstants.WRAPPING_PATTERN_OPTIONS.find(
      (o) => o.id === pattern
    )?.label ?? pattern;

  return (
    <div className="container py-4">
      <div className={classes.pageHeader}>
        <h2 className={classes.pageTitle}>Створити AI-букет</h2>
        <p className={classes.pageSubtitle}>
          Опишіть бажаний букет — AI підбере квіти та оформлення
        </p>
      </div>

      <div className={classes.formCard}>
        {/* Style */}
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

        {/* Shape */}
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

        {/* Colors */}
        <div className={classes.formSection}>
          <div className={classes.formSectionTitle}>Кольори</div>
          <div className={classes.chipRow}>
            {FLOWER_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`${classes.chip} ${selectedColors.includes(color) ? classes.chipActive : ""}`}
                onClick={() => toggleColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
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

        {/* Additional comment */}
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

      {/* Result Modal */}
      {showModal && result && (
        <div className={classes.modalOverlay} onClick={() => setShowModal(false)}>
          <div
            className={classes.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={classes.modalHeader}>
              <h3 className={classes.modalTitle}>
                {result.bouquetDetails.bouquetName}
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
                    {result.bouquetDetails.shape}
                  </span>
                </div>

                {result.bouquetDetails.wrappingPaper && (
                  <div className={classes.detailRow}>
                    <span className={classes.detailLabel}>Обгортка:</span>
                    <span className={classes.detailValue}>
                      {getWrappingTypeLabel(
                        result.bouquetDetails.wrappingPaper.type
                      )}
                      ,{" "}
                      {getWrappingPatternLabel(
                        result.bouquetDetails.wrappingPaper.pattern
                      )}
                      , {result.bouquetDetails.wrappingPaper.colorName}
                    </span>
                  </div>
                )}

                <div className={classes.compositionTitle}>Склад букета:</div>
                <div className={classes.compositionList}>
                  {result.bouquetDetails.flowerComposition.map((item, i) => (
                    <div key={i} className={classes.compositionItem}>
                      <span className={classes.compositionName}>
                        {item.flower.flowerName}
                      </span>
                      <span className={classes.compositionMeta}>
                        {item.quantity} шт · {item.role} ·{" "}
                        {item.unitPrice.toFixed(0)} грн/шт
                      </span>
                    </div>
                  ))}
                </div>
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
