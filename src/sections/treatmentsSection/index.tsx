import styles from "./TreatmentsSection.module.css";

import { revealHeading } from "./animations/revealHeading";
import { revealMenu } from "./animations/revealMenu";
import { animateButtonHover } from "./animations/menuButtonHover";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

export const TreatmentsSection = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      revealHeading(styles.heading, styles.decorativeDescription);
      revealMenu(styles.menu, styles.menuCoverBlock);

      const section = ref.current;

      const buttons = document.querySelectorAll(`.${styles.button}`);
      buttons.forEach((button) => {
        if (!(button instanceof HTMLElement)) return;
        animateButtonHover(section, button, styles.movingBlock, styles.text);
      });
    },
    { scope: ref },
  );

  return (
    <div className={styles.test} ref={ref}>
      <div className={styles.decorativeDescription}>
        In my studio, we can create an individual care plan specifically for
        you.
      </div>
      <h2 className={styles.heading}>Treatments</h2>
      <div className={styles.menu}>
        <div className={styles.menuCoverBlock} />
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
    </div>
  );
};
