import styles from "./TreatmentsSection.module.css";
import { useEffect } from "react";

import { moveBlockFromTop } from "./animations/moveBlockFromTop";
import { moveBlockFromBottom } from "./animations/moveBlockFromBottom";
import { moveBlockToBottom } from "./animations/moveBlockToBottom";
import { moveBlockToTop } from "./animations/moveBlockToTop";

import { setStartingPosition } from "./utils/setStartingPosition";
import { isCursorEnteredFromTop } from "./utils/isCursorEnteredFromTop";

export const TreatmentsSection = () => {
  useEffect(() => {
    let previousCursorYCoord = 0;
    document.addEventListener("mousemove", (e: MouseEvent) => {
      previousCursorYCoord = e.clientY;
    });

    const buttons = document.querySelectorAll(`.${styles.button}`);
    buttons.forEach((button) => {
      if (!(button instanceof HTMLElement)) return;

      const movingBlock = button.querySelector(
        `.${styles.movingBlock}`,
      ) as HTMLElement;
      const movingBlockText = movingBlock.querySelector(
        `.${styles.text}`,
      ) as HTMLElement;

      button.addEventListener("mouseenter", () => {
        if (isCursorEnteredFromTop(button, previousCursorYCoord)) {
          moveBlockFromTop(movingBlock, movingBlockText);
        } else {
          setStartingPosition(movingBlock, movingBlockText);
          moveBlockFromBottom(movingBlock, movingBlockText);
        }
      });

      button.addEventListener("mouseleave", (event: MouseEvent) => {
        if (event.y > previousCursorYCoord) {
          moveBlockToBottom(movingBlock, movingBlockText);
        } else {
          moveBlockToTop(movingBlock, movingBlockText);
        }
      });
    });
  }, []);
  return (
    <div className={styles.test}>
      <div className={styles.decorativeDescription}>
        In my studio, we can create an individual care plan specifically for
        you.
      </div>
      <h2 className={styles.heading}>Treatments</h2>

      <div className={`${styles.button} ${styles.first}`}>
        <div className={styles.movingBlock}>
          <span className={styles.text}>Фракционный RF</span>
          <img
            className={styles.movingArrow}
            src="/Vector.svg"
            alt="moving icon"
          />
        </div>
        <span className={styles.buttonText}>Фракционный RF</span>
      </div>
      <div className={styles.button}>
        <div className={styles.movingBlock}>
          <span className={styles.text}>Химический пилинг</span>
          <img
            className={styles.movingArrow}
            src="/Vector.svg"
            alt="moving icon"
          />
        </div>
        <span className={styles.buttonText}>Химический пилинг</span>
        <img
          className={styles.movingArrow}
          src="/Vector.svg"
          alt="moving icon"
        />
      </div>
      <div className={styles.button}>
        <div className={styles.movingBlock}>
          <span className={styles.text}>Микроигольчатый RF-термолиз</span>{" "}
          <img
            className={styles.movingArrow}
            src="/Vector.svg"
            alt="moving icon"
          />
        </div>
        <span className={styles.buttonText}>Микроигольчатый RF-термолиз</span>
        <img
          className={styles.movingArrow}
          src="/Vector.svg"
          alt="moving icon"
        />
      </div>
      <div className={styles.button}>
        <div className={styles.movingBlock}>
          <span className={styles.text}>Чистка лица</span>
          <img
            className={styles.movingArrow}
            src="/Vector.svg"
            alt="moving icon"
          />
        </div>
        <span className={styles.buttonText}>Чистка лица</span>
      </div>
      <div className={styles.button}>
        <div className={styles.movingBlock}>
          <span className={styles.text}>RF-лифтинг (термолифтинг)</span>
          <img
            className={styles.movingArrow}
            src="/Vector.svg"
            alt="moving icon"
          />
        </div>
        <span className={styles.buttonText}>RF-лифтинг (термолифтинг)</span>
      </div>
      <div className={styles.button}>
        <div className={styles.movingBlock}>
          <span className={styles.text}>Dr.Platon</span>
          <img
            className={styles.movingArrow}
            src="/Vector.svg"
            alt="moving icon"
          />
        </div>
        <span className={styles.buttonText}>Dr.Platon</span>
      </div>
      <div className={styles.button}>
        <div className={styles.movingBlock}>
          <span className={styles.text}>Мезотерапия</span>
          <img
            className={styles.movingArrow}
            src="/Vector.svg"
            alt="moving icon"
          />
        </div>
        <span className={styles.buttonText}>Мезотерапия</span>
        <img
          className={styles.movingArrow}
          src="/Vector.svg"
          alt="moving icon"
        />
      </div>
      <div className={styles.button}>
        <div className={styles.movingBlock}>
          <span className={styles.text}>Массаж лица Тоффа</span>
          <img
            className={styles.movingArrow}
            src="/Vector.svg"
            alt="moving icon"
          />
        </div>
        <span className={styles.buttonText}>Массаж лица Тоффа</span>
        <img
          className={styles.movingArrow}
          src="/Vector.svg"
          alt="moving icon"
        />
      </div>
      <div className={styles.button}>
        <div className={styles.movingBlock}>
          <span className={styles.text}>Термолифтинг</span>
          <img
            className={styles.movingArrow}
            src="/Vector.svg"
            alt="moving icon"
          />
        </div>
        <span className={styles.buttonText}>Термолифтинг</span>
      </div>
    </div>
  );
};
