"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./Select.module.css";
import { mockTreatments } from "@/shared/mocks/treatments";
import clsx from "clsx";

type SelectProps = {
  className: string;
  value?: number | null;
  onChange?: (id: number | null) => void;
  options?: { id: number; name: string }[];
  allLabel?: string;
  label?: string;
  triggerContent?: ReactNode;
  placement?: "bottom" | "top";
};

export const Select = ({ className, value, onChange, options = mockTreatments, allLabel, label = "Выберите процедуру", triggerContent, placement = "bottom" }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [internalValue, setInternalValue] = useState<number | null>(null);
  const selectedId = value === undefined ? internalValue : value;
  const items: { id: number | null; name: string }[] = allLabel ? [{ id: null, name: allLabel }, ...options] : options;
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selectedIndex = items.findIndex(item => item.id === selectedId);

  function open() {
    setHighlightedIndex(Math.max(0, selectedIndex));
    setIsOpen(true);
  }
  function select(index: number) {
    const item = items[index];
    if (!item) return;
    setInternalValue(item.id);
    onChange?.(item.id);
    setIsOpen(false);
    buttonRef.current?.focus();
  }
  function handleKeyDown(event: React.KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key)) event.preventDefault();
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        if (!isOpen) open();
        else setHighlightedIndex(index => (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % Math.max(1, items.length));
        break;
      case "Home": setIsOpen(true); setHighlightedIndex(0); break;
      case "End": setIsOpen(true); setHighlightedIndex(Math.max(0, items.length - 1)); break;
      case "Enter":
      case " ": if (isOpen) select(highlightedIndex); else open(); break;
      case "Escape": event.preventDefault(); setIsOpen(false); break;
      case "Tab": setIsOpen(false); break;
    }
  }
  useEffect(() => {
    if (!isOpen) return;
    function outside(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) listRef.current?.children[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, highlightedIndex]);

  return (
    <div ref={containerRef} className={clsx(styles.select, className, { [styles.isOpen]: isOpen, [styles.opensUp]: placement === "top" })}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false); }}>
      <button ref={buttonRef} type="button" role="combobox" aria-label={label}
        aria-haspopup="listbox" aria-controls={listId} aria-expanded={isOpen}
        aria-activedescendant={isOpen && items.length ? `${listId}-${highlightedIndex}` : undefined}
        className={clsx(styles.openButton, { [styles.iconButton]: triggerContent !== undefined })} onClick={() => isOpen ? setIsOpen(false) : open()} onKeyDown={handleKeyDown}>
        {triggerContent ?? <>
        <span className={styles.buttonText}>{items[selectedIndex]?.name ?? label}</span>
        <svg aria-hidden="true" width="15" height="8" viewBox="0 0 15 8" className={styles.buttonArrow}>
          <path d="M1 7L7.5 1L14 7" fill="none" stroke="currentColor" />
        </svg>
        </>}
      </button>
      {isOpen && <ul ref={listRef} id={listId} role="listbox" aria-label={label} className={styles.selectList}>
        {items.map((item, index) => <li key={item.id ?? "all"} id={`${listId}-${index}`} role="option"
          aria-selected={item.id === selectedId}
          className={clsx(styles.selectItem, { [styles.isHighlighted]: index === highlightedIndex, [styles.selected]: item.id === selectedId })}
          onPointerDown={event => event.preventDefault()} onClick={() => select(index)} onMouseEnter={() => setHighlightedIndex(index)}>
          {item.name}
        </li>)}
      </ul>}
    </div>
  );
};
