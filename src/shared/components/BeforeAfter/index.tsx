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

    const setPosition = (percent: number) => {
      if (!container) return;
      const width = container.getBoundingClientRect().width;
      const x = Math.max(15, Math.min(width * percent / 100, width - 15));
      const position = x / width * 100;
      slider.style.left = `${position}%`;
      beforeImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
      slider.setAttribute("aria-valuenow", String(Math.round((x - 15) / (width - 30) * 100)));
    };
    slider.setAttribute("role", "slider");
    slider.setAttribute("tabindex", "0");
    slider.setAttribute("aria-label", "Сравнение фото до и после");
    slider.setAttribute("aria-valuemin", "0");
    slider.setAttribute("aria-valuemax", "100");
    slider.setAttribute("aria-valuenow", "0");
    const onKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const current = parseFloat(slider.style.left) || 0;
      setPosition(event.key === "Home" ? 0 : event.key === "End" ? 100 : current + (event.key === "ArrowRight" ? 5 : -5));
    };
    slider.addEventListener("keydown", onKeyDown);
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      if (!container) return;
      const rect = container.getBoundingClientRect();
      let x = e.clientX - rect.left;
      x = Math.max(15, Math.min(x, rect.width - 15));
      const sliderPosition = (x / rect.width) * 100;
      setPosition(sliderPosition);
    };
    slider?.addEventListener("pointerdown", onPointerDown);
    slider?.addEventListener("pointerup", onPointerUp);
    slider?.addEventListener("pointercancel", onPointerCancel);
    container?.addEventListener("pointermove", onPointerMove);
    return () => {
      slider.removeEventListener("keydown", onKeyDown);
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
