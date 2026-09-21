"use client";

import clsx from "clsx";
import styles from "./Carousel.module.css";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

import { mockVideos as MOCKDATA } from "@/shared/mocks/videos";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { animateAppearance } from "./animations";
import { useNearViewport } from "@/shared/hooks/useNearViewport";
import { CarouselItem } from "../CarouselItem";

export const Carousel = () => {
  const mediaContainer = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(
    Math.floor((MOCKDATA.length - 1) / 2),
  );

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isNear = useNearViewport(mediaContainer, false);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useGSAP(() => {
    animateAppearance(mediaContainer, activeIndex);
  });

  // Determine the nearest item horizontally, even while preparing offscreen.
  useEffect(() => {
    const container = mediaContainer.current;
    if (!container) return;
    const updateActive = () => {
      const bounds = container.getBoundingClientRect();
      const center = bounds.left + bounds.width / 2;
      let nearest = 0;
      let distance = Infinity;
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const nextDistance = Math.abs(rect.left + rect.width / 2 - center);
        if (nextDistance < distance) {
          distance = nextDistance;
          nearest = index;
        }
      });
      setActiveIndex(nearest);
    };
    container.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();
    return () => {
      container.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  // пауза на активном видео, когда карусель выходит из области видимости
  useEffect(() => {
    const container = mediaContainer.current;

    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const [hintTrigger, setHintTrigger] = useState(0);

  useEffect(() => {
    if (soundEnabled) return;
    let timeoutId: ReturnType<typeof setTimeout>;

    const triggerHint = () => {
      setHintTrigger((prev) => prev + 1);

      timeoutId = setTimeout(triggerHint, 20000);
    };

    // первый запуск через 2 секунды, последующие через 20

    timeoutId = setTimeout(triggerHint, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeIndex, soundEnabled]);

  return (
    <div className={styles.carousel} ref={carouselRef}>
      <div ref={mediaContainer} className={styles.mediaContainer}>
        {MOCKDATA.map((link, index) => {
          return (
            <CarouselItem
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              key={index}
              link={link}
              isActive={index === activeIndex}
              shouldPreload={Math.abs(index - activeIndex) <= 1}
              isVisible={isVisible}
              isNear={isNear}
              index={index}
              hintTrigger={hintTrigger}
              soundEnabled={soundEnabled}
              onEnableSound={() => {
                setSoundEnabled((enabled) => !enabled);
              }}
            />
          );
        })}
      </div>

      <button
        aria-label="Предыдущее видео"
        onClick={() => {
          itemRefs.current[Math.max(0, activeIndex - 1)]?.scrollIntoView({
            behavior: document.documentElement.dataset.a11yMotion === "true" ? "instant" : "smooth",
            inline: "center",
            block: "nearest",
          });
        }}
        className={clsx(
          styles.button,
          styles.backButton,
          activeIndex === 0 && styles.outOfViewport,
        )}
      >
        <ArrowSVG className={styles.arrow} />
      </button>
      <button
        aria-label="Следующее видео"
        onClick={() => {
          itemRefs.current[
            Math.min(activeIndex + 1, MOCKDATA.length - 1)
          ]?.scrollIntoView({
            behavior: document.documentElement.dataset.a11yMotion === "true" ? "instant" : "smooth",
            inline: "center",
            block: "nearest",
          });
        }}
        className={clsx(
          styles.button,
          styles.forwardButton,
          activeIndex === MOCKDATA.length - 1 && styles.outOfViewport,
        )}
      >
        <ArrowSVG className={styles.arrow} />
      </button>
    </div>
  );
};
