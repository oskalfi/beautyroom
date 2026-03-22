"use client";

import styles from "./page.module.css";

import { IntroduceSection } from "@/sections/introduceSection";
import { WelcomeSection } from "@/sections/welcomeSection";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    let currentCursorYCoord = 0;
    document.addEventListener("mousemove", (e: MouseEvent) => {
      currentCursorYCoord = e.clientY;
    });

    const links = document.querySelectorAll(`.${styles.link}`);

    links.forEach((link) => {
      if (!(link instanceof HTMLElement)) return;
      const elementTop = link.getBoundingClientRect().top;
      const topBlock = link.querySelector(`.${styles.blockMovingFromTop}`);
      const bottomBlock = link.querySelector(
        `.${styles.blockMovingFromBottom}`,
      );
      link.addEventListener("mouseenter", () => {
        const cursorEnteredFrom =
          elementTop - currentCursorYCoord > 0 ? "top" : "bottom";
        if (cursorEnteredFrom === "top") {
          topBlock?.classList.add(styles.animate);
        } else {
          bottomBlock?.classList.add(styles.animate);
        }
      });

      function animate() {}

      link.addEventListener("mouseleave", (event: MouseEvent) => {
        if (event.y > currentCursorYCoord) {
          // курсор ушел вверх
          bottomBlock?.classList.remove(styles.animate);
          topBlock?.classList.remove(styles.animate);
        } else {
          // курсор ушел вниз
          topBlock?.classList.remove(styles.animate);
          bottomBlock?.classList.remove(styles.animate);
        }
      });
    });
  }, []);

  return (
    <main>
      <WelcomeSection />
      <IntroduceSection />
      <div className={styles.test}>
        <h2>Treatments</h2>

        <div className={styles.link}>
          <div className={styles.blockMovingFromTop}>
            <span className={styles.textMovingFromTop}>Ссылка</span>
          </div>
          <span className={styles.linkText}>Ссылка</span>
          <div className={styles.blockMovingFromBottom}>
            <span className={styles.textMovingFromBottom}>Ссылка</span>
          </div>
        </div>
      </div>
    </main>
  );
}
