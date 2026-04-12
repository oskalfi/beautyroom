import styles from "./TreatmentItem.module.css";

import { previousCursorYCoord } from "../..";
import { moveBlockFromTop } from "../treatmentsItem/animations/moveBlockFromTop";
import { moveBlockFromBottom } from "../treatmentsItem/animations/moveBlockFromBottom";
import { moveBlockToBottom } from "../treatmentsItem/animations/moveBlockToBottom";
import { moveBlockToTop } from "../treatmentsItem/animations/moveBlockToTop";

import { setStartingPosition } from "../treatmentsItem/animations/setStartingPosition";
import { isCursorEnteredFromTop } from "../../utils/isCursorEnteredFromTop";
import { treatmentDataProps } from "../../../../shared/model/types";
import { useModalStore } from "@/shared/store/modalStore";

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
  const { openModal } = useModalStore();
  return (
    <li
      id={`${id}`}
      className={styles.button}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => openModal({ type: "TREATMENT", treatmentId: id })}
    >
      <div className={styles.movingBlock}>
        <span className={styles.text}>{name}</span>
        <img
          className={styles.movingArrow}
          src="/Vector.svg"
          alt="moving icon"
        />
      </div>
      <span className={styles.buttonText}>{name}</span>
    </li>
  );
};
