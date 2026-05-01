"use client";

import {
  SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./InstagramSection.module.css";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

import { MOCKDATA } from "./mockData";
import clsx from "clsx";

export const InstagramSection = () => {
  const videoContainer = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(
    Math.floor((MOCKDATA.length - 1) / 2),
  );

  useLayoutEffect(() => {
    const container = videoContainer.current;
    const activeVideo = container?.children?.[activeIndex] as HTMLVideoElement;

    if (!container || !activeVideo || !container.parentElement) return;

    const viewportWidth = container.parentElement.offsetWidth;

    const elementLeft = activeVideo.offsetLeft;
    const elementWidth = activeVideo.offsetWidth;
    const elementCenterInTrack = elementLeft + elementWidth / 2;

    // Вычисляем смещение
    const translateX = viewportWidth / 2 - elementCenterInTrack;

    container.style.transform = `translateX(${translateX}px)`;
  }, [activeIndex]);

  useEffect(() => {
    videoContainer.current?.classList.add(`${styles.animated}`);
  }, [activeIndex]);

  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.heading}>Остаёмся на связи</h2>

      <div className={styles.carousel}>
        <button
          onClick={() => {
            setActiveIndex((prev) => Math.max(0, prev - 1));
          }}
          className={`${styles.button} ${styles.backButton}`}
        >
          <ArrowSVG className={styles.arrow} />
        </button>
        <div ref={videoContainer} className={styles.videoContainer}>
          {MOCKDATA.map((link, index) => {
            //test
            return (
              <video
                key={index}
                className={clsx(
                  { [styles.activeVideo]: index === activeIndex },
                  styles.video,
                )}
                src={link}
              />
            );
          })}
        </div>
        <button
          onClick={() => {
            setActiveIndex((prev) => Math.min(prev + 1, MOCKDATA.length - 1));
          }}
          className={`${styles.button} ${styles.forwardButton}`}
        >
          <ArrowSVG className={styles.arrow} />
        </button>
      </div>
    </section>
  );
};
