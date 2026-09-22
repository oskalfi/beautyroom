import styles from "./TreatmentItem.module.css";

import { previousCursorYCoord } from "../..";
import { moveBlockFromTop } from "../treatmentsItem/animations/moveBlockFromTop";
import { moveBlockFromBottom } from "../treatmentsItem/animations/moveBlockFromBottom";
import { moveBlockToBottom } from "../treatmentsItem/animations/moveBlockToBottom";
import { moveBlockToTop } from "../treatmentsItem/animations/moveBlockToTop";

import { setStartingPosition } from "../treatmentsItem/animations/setStartingPosition";
import { isCursorEnteredFromTop } from "../../utils/isCursorEnteredFromTop";
import { treatmentDataProps } from "../../../../shared/model/types";
import { Link } from "@/i18n/navigation";

function handleMouseEnter(event: React.MouseEvent<HTMLLIElement>) {
  if (event.currentTarget.dataset.focusActive === "true") return;
  if (
    window.matchMedia("(any-pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0
  )
    return;
  const movingBlock = event.currentTarget.querySelector(
    `.${styles.movingBlock}`,
  ) as HTMLElement;
  const movingBlockText = movingBlock?.querySelector(
    `.${styles.text}`,
  ) as HTMLElement;

  if (isCursorEnteredFromTop(event.currentTarget, previousCursorYCoord)) {
    moveBlockFromTop(movingBlock, movingBlockText);
  } else {
    setStartingPosition(movingBlock, movingBlockText);
    moveBlockFromBottom(movingBlock, movingBlockText);
  }
}

function handleMouseLeave(event: React.MouseEvent<HTMLLIElement>) {
  if (event.currentTarget.dataset.focusActive === "true") return;
  if (
    window.matchMedia("(any-pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0
  )
    return;
  const movingBlock = event.currentTarget.querySelector(
    `.${styles.movingBlock}`,
  ) as HTMLElement;
  const movingBlockText = movingBlock?.querySelector(
    `.${styles.text}`,
  ) as HTMLElement;
  if (event.clientY > previousCursorYCoord) {
    moveBlockToBottom(movingBlock, movingBlockText);
  } else {
    moveBlockToTop(movingBlock, movingBlockText);
  }
}

export const TreatmentItem = ({ id, name }: treatmentDataProps) => {
  const href = `/treatments/${id}`;
  return (
    <li
      id={`${id}`}
      data-treatment-item
      data-press-feedback
      className={styles.button}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        data-treatment-link
        href={href}
        prefetch={true}
        scroll={false}
        className={styles.link}
        onClick={(event) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          // Full navigation on phones opens the standalone treatment page.
          if (window.matchMedia("(max-width: 767px)").matches) {
            event.preventDefault();
            window.location.assign(event.currentTarget.href);
          }
        }}
      >
        <div className={styles.movingBlock} aria-hidden="true">
          <span className={styles.text}>{name}</span>
          <svg
            className={styles.movingArrow}
            width="43"
            height="23"
            viewBox="0 0 43 23"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M1.5 11.5H41.5M41.5 11.5L31.5 1.5M41.5 11.5L31.5 21.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className={styles.buttonText}>{name}</span>
        <div className={styles.invisibleBlock} />
      </Link>
    </li>
  );
};
