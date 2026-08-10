"use client";

import { SliderSVG } from "@/shared/assets/svg/Slider";
import styles from "./BeforeAfter.module.css";
import { useEffect, useRef } from "react";

type TBeforeAfterProps = {
  className: string;
};

export const BeforeAfter = ({ className }: TBeforeAfterProps) => {
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
      slider.classList.add(styles.isDragging);
    });

    slider?.addEventListener("pointerup", (e) => {
      isDragging = false;
      slider.releasePointerCapture(e.pointerId);
      slider.classList.remove(styles.isDragging);
    });

    slider?.addEventListener("pointercancel", (e) => {
      isDragging = false;
      slider.releasePointerCapture(e.pointerId);
      slider.classList.remove(styles.isDragging);
    });

    container?.addEventListener("pointermove", (e) => {
      if (!isDragging) return;

      const rect = container.getBoundingClientRect();
      const padding = 15;
      let x = e.clientX - rect.left;
      x = Math.max(padding, Math.min(x, rect.width - padding));
      const sliderPosition = (x / rect.width) * 100;
      slider.style.left = `${sliderPosition}%`;
      beforeImage.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
    });
  }, []);

  return (
    <div className={`${styles.beforeAfterComponent} ${className}`} ref={ref}>
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
