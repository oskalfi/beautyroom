"use client";

import { useEffect, useReducer, useRef } from "react";
import styles from "./Select.module.css";
import { mockData } from "@/sections/treatmentsSection/mockData";
import clsx from "clsx";

type TState = {
  isOpen: boolean;
  highlightedIndex: number;
  selectedId: number | null;
};

type TAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "MOVE"; direction: "up" | "down" }
  | { type: "SELECT"; id: number }
  | { type: "HOVER"; index: number };

function selectReducer(state: TState, action: TAction): TState {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        isOpen: true,
        highlightedIndex:
          state.selectedId !== null
            ? mockData.findIndex((i) => i.id === state.selectedId)
            : 0,
      };
    case "CLOSE":
      return {
        ...state,
        isOpen: false,
      };
    case "MOVE":
      const next =
        action.direction === "down"
          ? (state.highlightedIndex + 1) % mockData.length
          : (state.highlightedIndex - 1 + mockData.length) % mockData.length;

      return {
        ...state,
        highlightedIndex: next,
      };
    case "HOVER":
      return {
        ...state,
        highlightedIndex: action.index,
      };
    case "SELECT":
      return {
        ...state,
        isOpen: false,
        selectedId: action.id,
        highlightedIndex: mockData.findIndex((i) => i.id === action.id),
      };
  }
}

export const Select = () => {
  const [state, dispatch] = useReducer(selectReducer, {
    isOpen: false,
    highlightedIndex: 0,
    selectedId: null,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectListRef = useRef<HTMLUListElement | null>(null);

  const selectedTreatmentText = mockData.find(
    (treatment) => treatment.id === state.selectedId,
  )?.name;

  function toggle(e: React.MouseEvent) {
    dispatch({ type: state.isOpen ? "CLOSE" : "OPEN" });
  }

  function handleClickOutside(e: MouseEvent) {
    if (!containerRef.current?.contains(e.target as Node)) {
      dispatch({ type: "CLOSE" });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        dispatch({ type: "MOVE", direction: "down" });
        break;
      case "ArrowUp":
        e.preventDefault();
        dispatch({ type: "MOVE", direction: "up" });
        break;
      case "Enter":
        e.preventDefault();
        if (!state.isOpen) dispatch({ type: "OPEN" });
        else {
          const highlightedTreatmentId = mockData[state.highlightedIndex].id;
          dispatch({ type: "SELECT", id: highlightedTreatmentId });
        }
        break;
      case "Escape":
        e.preventDefault();
        dispatch({ type: "CLOSE" });
        break;
    }
  }

  useEffect(() => {
    if (!state.isOpen) return;
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      containerRef.current?.removeEventListener(
        "pointerdown",
        handleClickOutside,
      );
    };
  }, [state.isOpen]);

  return (
    <div
      className={clsx(styles.select, {
        [styles.isOpen]: state.isOpen,
      })}
      ref={containerRef}
    >
      <button
        type="button"
        className={styles.openButton}
        aria-haspopup="listbox"
        aria-controls="listbox"
        aria-expanded={state.isOpen}
        aria-activedescendant={
          state.isOpen ? `option-${state.highlightedIndex}` : undefined
        }
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.buttonText}>
          {selectedTreatmentText ?? "Открыть список"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="7"
          viewBox="0 0 1440 672"
          className={styles.buttonArrow}
        >
          <path
            fill="currentColor"
            d="M1402 666c27-10 43-36 37-63-3-12-41-46-345-306C789 37 750 5 736 2c-39-6-16-23-388 295C-24 614-5 596 3 628c4 18 28 38 48 42 39 6 19 20 358-269l312-266 310 265c173 148 314 266 321 268 15 5 35 4 50-2"
          />
        </svg>
      </button>
      {state.isOpen && (
        <ul
          id="listbox"
          className={styles.selectList}
          role="listbox"
          aria-label="Выберите процедуру"
          ref={selectListRef}
          tabIndex={-1}
        >
          {mockData.map((treatment, index) => {
            return (
              <li
                className={clsx(styles.selectItem, {
                  [styles.isHighlighted]: state.highlightedIndex === index,
                  [styles.selected]: state.selectedId === treatment.id,
                })}
                key={treatment.id}
                id={`option-${index}`}
                role="option"
                aria-selected={treatment.id === state.selectedId}
                onClick={() => {
                  dispatch({ type: "SELECT", id: treatment.id });
                }}
                onMouseEnter={() => {
                  dispatch({ type: "HOVER", index: index });
                }}
              >
                {treatment.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
