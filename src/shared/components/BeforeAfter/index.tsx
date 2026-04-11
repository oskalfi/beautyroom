"use client";

import { SliderSVG } from "@/shared/assets/svg/Slider";
import styles from "./BeforeAfter.module.css";
import { useEffect, useRef } from "react";

export const BeforeAfter = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    const beforeImage = container?.querySelector(
      `.${styles.beforeImage}`,
    ) as HTMLElement;
    const slider = container?.querySelector(`.${styles.slider}`) as HTMLElement;
    let isDragging = false;

    slider?.addEventListener("pointerdown", (e) => {
      isDragging = true;
      slider.setPointerCapture(e.pointerId);
    });

    slider?.addEventListener("pointerup", (e) => {
      isDragging = false;
      slider.releasePointerCapture(e.pointerId);
    });

    slider?.addEventListener("pointercancel", (e) => {
      isDragging = false;
      slider.releasePointerCapture(e.pointerId);
    });

    container?.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const rect = container?.getBoundingClientRect();
      let x = e.clientX - rect.left; // cursor X coordinate relative to the left edge of rect
      x = Math.max(0, Math.min(x, rect.width)); // limits of acceptable values for slider movement
      const sliderPosition = (x / rect.width) * 100;
      slider.style.left = `${sliderPosition}%`;
      beforeImage.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
    });
  }, []);

  return (
    <div className={styles.beforeAfterComponent} ref={ref}>
      <img
        className={styles.afterImage}
        src="/after.jpg"
        alt="after «Treatment»"
      />
      <div className={styles.beforeImage} />
      <SliderSVG className={styles.slider} />
    </div>
  );
};
