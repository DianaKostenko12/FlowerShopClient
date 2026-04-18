import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const usePhotoUpload = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoPreviewUrl = useMemo(
    () => (photo ? URL.createObjectURL(photo) : undefined),
    [photo]
  );

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPhoto(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      setPhoto(file);
    }
  };

  const resetPhoto = () => {
    setPhoto(null);
  };

  return {
    photo,
    photoPreviewUrl,
    isDragging,
    fileInputRef,
    handlePhotoChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetPhoto,
  };
};
