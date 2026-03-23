"use client";

import styles from "./page.module.css";

import { IntroduceSection } from "@/sections/introduceSection";
import { WelcomeSection } from "@/sections/welcomeSection";
import { useEffect } from "react";

import { moveBlockFromTop } from "@/sections/treatmentsSection/animations/moveBlockFromTop";
import { moveBlockFromBottom } from "@/sections/treatmentsSection/animations/moveBlockFromBottom";

import { setStartingPosition } from "@/sections/treatmentsSection/utils/setStartingPosition";
import { moveBlockToBottom } from "@/sections/treatmentsSection/animations/moveBlockToBottom";
import { moveBlockToTop } from "@/sections/treatmentsSection/animations/moveBlockToTop";

export default function Home() {
  useEffect(() => {
    let currentCursorYCoord = 0;
    document.addEventListener("mousemove", (e: MouseEvent) => {
      currentCursorYCoord = e.clientY;
    });
    document.addEventListener("scroll", (e) => {});

    const links = document.querySelectorAll(`.${styles.link}`);

    links.forEach((link) => {
      if (!(link instanceof HTMLElement)) return;
      const elementTop = link.getBoundingClientRect().top;
      const movingBlock = link.querySelector(
        `.${styles.movingBlock}`,
      ) as HTMLElement;
      const movingBlockText = movingBlock.querySelector(
        `.${styles.text}`,
      ) as HTMLElement;
      const linkText = link.querySelector(`.${styles.linkText}`) as HTMLElement;
      link.addEventListener("mouseenter", () => {
        const cursorEnteredFrom =
          elementTop - currentCursorYCoord > 0 ? "top" : "bottom";
        if (cursorEnteredFrom === "top") {
          moveBlockFromTop(movingBlock, movingBlockText);
        } else {
          setStartingPosition(movingBlock, movingBlockText);
          moveBlockFromBottom(movingBlock, movingBlockText);
        }
      });

      link.addEventListener("mouseleave", (event: MouseEvent) => {
        if (event.y > currentCursorYCoord) {
          // курсор ушел вниз
          moveBlockToBottom(movingBlock, movingBlockText);
        } else {
          // курсор ушел вверх
          moveBlockToTop(movingBlock, movingBlockText);
        }
      });
      link.addEventListener("scroll", () => {});
    });
  }, []);

  return (
    <main>
      <WelcomeSection />
      <IntroduceSection />
      <div className={styles.test}>
        <h2>Treatments</h2>

        <div className={styles.link}>
          <div className={styles.movingBlock}>
            <span className={styles.text}>Ссылка</span>
          </div>
          <span className={styles.linkText}>Ссылка</span>
        </div>
        <div className={styles.link}>
          <div className={styles.movingBlock}>
            <span className={styles.text}>Ссылка</span>
          </div>
          <span className={styles.linkText}>Ссылка</span>
        </div>
        <div className={styles.link}>
          <div className={styles.movingBlock}>
            <span className={styles.text}>Ссылка</span>
          </div>
          <span className={styles.linkText}>Ссылка</span>
        </div>
        <div className={styles.link}>
          <div className={styles.movingBlock}>
            <span className={styles.text}>Ссылка</span>
          </div>
          <span className={styles.linkText}>Ссылка</span>
        </div>
        <div className={styles.link}>
          <div className={styles.movingBlock}>
            <span className={styles.text}>Ссылка</span>
          </div>
          <span className={styles.linkText}>Ссылка</span>
        </div>
      </div>
    </main>
  );
}
