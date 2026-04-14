import { useEffect, useRef, useState } from "react";
import styles from "./boquetsPage.module.css";

export interface MultiSelectOption {
  id: number | string;
  label: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  selectedIds: Array<number | string>;
  onSelect: (optionId: number | string) => void;
}

const MultiSelectDropdown = ({
  label,
  options,
  selectedIds,
  onSelect,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.dropdown}>
        <button
          type="button"
          className={`${styles.customButton} ${styles.dropdownButton}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={styles.dropdownLabel}>{label}</span>
          <span className={styles.dropdownArrow} aria-hidden="true" />
        </button>
        {isOpen && (
          <ul className={styles.dropdownList} role="listbox">
            {options.map((option) => (
              <li
                key={option.id}
                className={
                  selectedIds.includes(option.id) ? styles.selectedItem : ""
                }
                onClick={() => onSelect(option.id)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
