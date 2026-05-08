import clsx from "clsx";
import styles from "./Carousel.module.css";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

import { MOCKDATA } from "./mockData";

import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { animateAppearance } from "./animations";
import { CarouselItem } from "../CarouselItem";

export const Carousel = () => {
  const mediaContainer = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(
    Math.floor((MOCKDATA.length - 1) / 2),
  );

  useLayoutEffect(() => {
    const container = mediaContainer.current;

    if (!container || !container.parentElement) return;

    const updatePosition = () => {
      const activeMedia = container.children[activeIndex] as HTMLElement;
      if (!activeMedia) return;
      const viewportWidth = container.parentElement!.offsetWidth;
      const elementCenterInTrack =
        activeMedia.offsetLeft + activeMedia.offsetWidth / 2;
      const translateX = viewportWidth / 2 - elementCenterInTrack;
      container.style.transform = `translate3d(${translateX}px, 0, 0)`;
    };

    updatePosition();

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    resizeObserver.observe(container.parentElement);

    Array.from(container.children).forEach((child) => {
      resizeObserver.observe(child);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeIndex]);

  useGSAP(() => {
    animateAppearance(mediaContainer);
  });

  return (
    <div className={styles.carousel}>
      <div ref={mediaContainer} className={styles.mediaContainer}>
        {MOCKDATA.map((link, index) => {
          return (
            <CarouselItem
              key={index}
              link={link}
              isActive={index === activeIndex}
            />
          );
        })}
      </div>

      <button
        onClick={() => {
          setActiveIndex((prev) => Math.max(0, prev - 1));
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
        onClick={() => {
          setActiveIndex((prev) => Math.min(prev + 1, MOCKDATA.length - 1));
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
