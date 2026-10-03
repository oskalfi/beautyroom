"use client";
import { useTranslations } from "next-intl";

import { LazyImage } from "@/shared/components/LazyImage";

import { Carousel } from "@/shared/components/Carousel";
import { RevealHeading } from "@/shared/components/RevealHeading";
import styles from "./InstagramSection.module.css";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

export const InstagramSection = () => {
  const t = useTranslations("Home");
  const refWhiteText = useRef<HTMLSpanElement | null>(null);
  const isAnimating = useRef(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.href;

    // Защита от повторных кликов во время анимации
    if (isAnimating.current || !refWhiteText.current) return;
    isAnimating.current = true;

    const split = new SplitText(refWhiteText.current, { type: "chars" });
    const stepDuration = 0.12;

    gsap.to(split.chars, {
      keyframes: [
        { y: -12, duration: stepDuration, ease: "sine.inOut" },
        { y: 0, duration: stepDuration, ease: "sine.inOut" },
      ],
      stagger: stepDuration / 6,
      onComplete: () => {
        split.revert(); // Очищаем временные span-теги в DOM
        isAnimating.current = false;

        // Переход точно после завершения анимации
        window.open(href, "_blank", "noopener,noreferrer");
      },
    });
  };

  return (
    <section className={styles.sectionContainer}>
      <div className={styles.wrapper}>
        <RevealHeading className={styles.heading}>{t("instagram")}</RevealHeading>
        <Image
          src="/instagram.png"
          width={36}
          height={36}
          alt="Instagram"
          className={styles.instIcon}
        />
      </div>

      <Carousel />
      <a
        data-press-feedback
        onClick={handleClick}
        href="https://www.instagram.com/kristina_beautician/"
        className={styles.buttonWrapper}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.toInstButton} aria-hidden="true">
          <LazyImage src="/arrowInst.svg" alt="" className={styles.arrow} />
          <div className={styles.buttonTextWrapper}>
            <span className={styles.buttonTextWhite} ref={refWhiteText}>
              {t("visitInstagram")}
            </span>
          </div>
        </div>
        <span className={styles.buttonTextBlack}>{t("visitInstagram")}</span>
      </a>
    </section>
  );
};
