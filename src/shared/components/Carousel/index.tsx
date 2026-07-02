"use client";

import clsx from "clsx";
import styles from "./Carousel.module.css";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

import { MOCKDATA } from "./mockData";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { animateAppearance } from "./animations";
import { CarouselItem } from "../CarouselItem";

export const Carousel = () => {
  const mediaContainer = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(
    Math.floor((MOCKDATA.length - 1) / 2),
  );

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    animateAppearance(mediaContainer, activeIndex);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const active = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex((prev) => (prev === active ? prev : active));
          }
        });
      },
      {
        rootMargin: "0px -50% 0px -50%",
        threshold: 0,
      },
    );

    itemRefs.current.forEach((item) => observer.observe(item as Element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    mediaContainer.current!.addEventListener("scrollend", handler);
    return () => {
      mediaContainer.current!.removeEventListener("scrollend", handler);
    };
  }, [activeIndex]);

  function handler(e: Event) {
    itemRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

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
              index={index}
            />
          );
        })}
      </div>

      <button
        onClick={() => {
          itemRefs.current[Math.max(0, activeIndex - 1)]?.scrollIntoView({
            behavior: "smooth",
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
        onClick={() => {
          itemRefs.current[
            Math.min(activeIndex + 1, MOCKDATA.length - 1)
          ]?.scrollIntoView({
            behavior: "smooth",
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
