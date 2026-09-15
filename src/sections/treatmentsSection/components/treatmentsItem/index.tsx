import styles from "./TreatmentItem.module.css";

import { previousCursorYCoord } from "../..";
import { moveBlockFromTop } from "../treatmentsItem/animations/moveBlockFromTop";
import { moveBlockFromBottom } from "../treatmentsItem/animations/moveBlockFromBottom";
import { moveBlockToBottom } from "../treatmentsItem/animations/moveBlockToBottom";
import { moveBlockToTop } from "../treatmentsItem/animations/moveBlockToTop";

import { setStartingPosition } from "../treatmentsItem/animations/setStartingPosition";
import { isCursorEnteredFromTop } from "../../utils/isCursorEnteredFromTop";
import { treatmentDataProps } from "../../../../shared/model/types";
import { useRouter } from "next/navigation";

function handleMouseEnter(event: React.MouseEvent<HTMLLIElement>) {
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
  const router = useRouter();
  const href = `/treatments/${id}`;
  return (
    <li
      id={`${id}`}
      className={styles.button}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={href}
        className={styles.link}
        onClick={(event) => {
          if (
            event.defaultPrevented || event.button !== 0 ||
            event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
          ) return;
          // Full navigation on phones opens the standalone treatment page.
          if (window.matchMedia("(min-width: 768px)").matches) {
            event.preventDefault();
            router.push(href, { scroll: false });
          }
        }}
      >
      <div className={styles.movingBlock} aria-hidden="true">
        <span className={styles.text}>{name}</span>
        <img
          className={styles.movingArrow}
          src="/Vector.svg"
          alt="moving icon"
        />
      </div>
      <span className={styles.buttonText}>{name}</span>
      </a>
    </li>
  );
};
