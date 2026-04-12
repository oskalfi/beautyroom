"use client";

import { useEffect, useReducer } from "react";
import styles from "./Select.module.css";
import { mockData } from "@/sections/treatmentsSection/mockData";

type TState = {
  isOpen: boolean;
  highlightedIndex: number;
  selectedId: number | null;
};

type TAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "MOVE"; direction: "up" | "down" }
  | { type: "SELECT"; id: number };

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
          ? Math.min(mockData.length - 1, state.highlightedIndex + 1)
          : Math.max(0, state.highlightedIndex - 1);

      return {
        ...state,
        highlightedIndex: next,
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

  const selectedTreatmentText = mockData.find(
    (treatment) => treatment.id === state.selectedId,
  )?.name;

  useEffect(() => {
    console.log(state.selectedId);
  }, [state.selectedId]);

  return (
    <div className={styles.select}>
      <button
        type="button"
        className={styles.openButton}
        aria-haspopup="listbox"
        aria-expanded={state.isOpen}
        aria-controls="listbox"
        onClick={() => 0}
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
      <ul
        id="listbox"
        className={styles.selectList}
        role="listbox"
        aria-label="Выберите процедуру"
      >
        {mockData.map((treatment) => {
          return (
            <li
              className={styles.selectItem}
              key={treatment.id}
              id={`${treatment.id}`}
              role="option"
              aria-selected={treatment.id === state.selectedId}
              onMouseEnter={() => 0}
              onClick={() => {
                dispatch({ type: "SELECT", id: treatment.id });
              }}
            >
              {treatment.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
