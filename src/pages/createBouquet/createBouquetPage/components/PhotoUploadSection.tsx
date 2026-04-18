import { ChangeEvent, DragEvent, FC, RefObject } from "react";
import classes from "../createBouquet.module.css";

interface PhotoUploadSectionProps {
  photo: File | null;
  photoPreviewUrl?: string;
  isDragging: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
}

const PhotoUploadSection: FC<PhotoUploadSectionProps> = ({
  photo,
  photoPreviewUrl,
  isDragging,
  fileInputRef,
  onPhotoChange,
  onDragOver,
  onDragLeave,
  onDrop,
}) => (
  <div className={classes.formSection}>
    <div className={classes.formSectionTitle}>Фото букету</div>
    <div
      className={`${classes.dropZone} ${
        isDragging ? classes.dropZoneActive : ""
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <span className={classes.dropZoneIcon}>📷</span>
      <p className={classes.dropZoneText}>
        Перетягніть фото сюди або натисніть для вибору
      </p>
      {photo && <p className={classes.dropZoneFileName}>{photo.name}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onPhotoChange}
        style={{ display: "none" }}
      />
    </div>
    {photoPreviewUrl && (
      <img
        src={photoPreviewUrl}
        alt="Прев'ю"
        className={classes.photoPreview}
      />
    )}
  </div>
);

export default PhotoUploadSection;
