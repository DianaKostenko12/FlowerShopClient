import { useEffect, useMemo, useState } from "react";
import WrappingService, {
  WrappingPaperInfo,
} from "../../../API/WrappingService";
import { SelectOption } from "../constants/SelectOption";
import WrappingPaperConstants from "../constants/WrappingPaperConstants";

const parseOptionalNumber = (value: string): number | undefined =>
  value === "" ? undefined : Number(value);

export const useWrappingPaperSelection = (
  setError: (error: string | null) => void
) => {
  const [wrappingPapers, setWrappingPapers] = useState<WrappingPaperInfo[]>([]);
  const [wrappingType, setWrappingType] = useState<number>();
  const [wrappingPattern, setWrappingPattern] = useState<number>();
  const [wrappingColorId, setWrappingColorId] = useState<number>();
  const [isAddingWrappingColor, setIsAddingWrappingColor] = useState(false);
  const [isWrappingLoading, setIsWrappingLoading] = useState(false);

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
  }, [setError]);

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
    setWrappingType(parseOptionalNumber(value));
    setWrappingColorId(undefined);
    setIsAddingWrappingColor(false);
  };

  const handleWrappingPatternChange = (value: string) => {
    setWrappingPattern(parseOptionalNumber(value));
    setWrappingColorId(undefined);
    setIsAddingWrappingColor(false);
  };

  const handleWrappingColorChange = (value: string) => {
    if (value === WrappingPaperConstants.CUSTOM_WRAPPING_COLOR_OPTION) {
      setIsAddingWrappingColor(true);
      setWrappingColorId(undefined);
      return;
    }

    setIsAddingWrappingColor(false);
    setWrappingColorId(parseOptionalNumber(value));
  };

  const handleAdditionalWrappingColorChange = (value: string) => {
    setWrappingColorId(parseOptionalNumber(value));
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

  const resetWrappingPaperSelection = () => {
    setWrappingType(undefined);
    setWrappingPattern(undefined);
    setWrappingColorId(undefined);
    setIsAddingWrappingColor(false);
  };

  return {
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
  };
};
