"use client";
import { LazyImage } from "@/shared/components/LazyImage";


import { SliderSVG } from "@/shared/assets/svg/Slider";
import styles from "./BeforeAfter.module.css";
import { useEffect, useRef } from "react";

type TBeforeAfterProps = {
  className: string;
  beforeSrc: string;
  afterSrc: string;
  name: string;
};

export const BeforeAfter = ({ className, beforeSrc, afterSrc, name }: TBeforeAfterProps) => {
  const ref = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const container = ref.current;
    const beforeImage = container?.querySelector(
      `.${styles.beforeImage}`,
    ) as HTMLElement;
    const slider = container?.querySelector(`.${styles.slider}`) as HTMLElement;
    let isDragging = false;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      slider.setPointerCapture(e.pointerId);
      slider.classList.add(styles.isDragging);
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      slider.releasePointerCapture(e.pointerId);
      slider.classList.remove(styles.isDragging);
    };

    const onPointerCancel = (e: PointerEvent) => {
      isDragging = false;
      slider.releasePointerCapture(e.pointerId);
      slider.classList.remove(styles.isDragging);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      if (!container) return;
      const rect = container.getBoundingClientRect();
      let x = e.clientX - rect.left;
      x = Math.max(15, Math.min(x, rect.width - 15));
      const sliderPosition = (x / rect.width) * 100;
      slider.style.left = `${sliderPosition}%`;
      beforeImage.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
    };
    slider?.addEventListener("pointerdown", onPointerDown);
    slider?.addEventListener("pointerup", onPointerUp);
    slider?.addEventListener("pointercancel", onPointerCancel);
    container?.addEventListener("pointermove", onPointerMove);
    return () => {
      slider?.removeEventListener("pointerdown", onPointerDown);
      slider?.removeEventListener("pointerup", onPointerUp);
      slider?.removeEventListener("pointercancel", onPointerCancel);
      container?.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className={`${styles.beforeAfterComponent} ${className}`} ref={ref}>
      <LazyImage
        className={styles.afterImage}
        src={afterSrc}
        width={941} height={1672} sizes="(max-width: 540px) calc(100vw - 20px), 520px" quality={90}
        alt={`${name}: после`}
      />
      <div className={styles.beforeImage}>
        <LazyImage className={styles.afterImage} src={beforeSrc} alt={`${name}: до`}
          width={941} height={1672} sizes="(max-width: 540px) calc(100vw - 20px), 520px" quality={90} />
      </div>
      <SliderSVG className={styles.slider} />
    </div>
  );
};
