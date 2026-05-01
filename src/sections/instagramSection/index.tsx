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
  const progressBar = useRef<HTMLDivElement | null>(null);
  // const video = useRef<HTMLVideoElement | null>(null);
  const videoContainer = useRef<HTMLDivElement | null>(null);

  // function updateProgress() {
  //   const vid = video.current;
  //   const bar = progressBar.current;
  //   if (!vid || !bar) return;
  //   if (!vid.paused && !vid.ended) {
  //     const percentage = -100 + (vid.currentTime / vid.duration) * 100;
  //     bar.style.transform = `translateX(${percentage}%)`;
  //     requestAnimationFrame(updateProgress);
  //   }
  // }

  // function onTimeUpdate(e: SyntheticEvent<HTMLVideoElement>) {
  //   requestAnimationFrame(updateProgress);
  // }

  const [activeIndex, setActiveIndex] = useState(
    Math.floor((MOCKDATA.length - 1) / 2),
  );

  useLayoutEffect(() => {
    const container = videoContainer.current;
    const activeVideo = container?.children?.[activeIndex] as HTMLVideoElement;

    if (!container || !activeVideo || !container.parentElement) return;

    const viewportWidth = container.parentElement.offsetWidth;

    // 2. Находим центр активного видео относительно начала трека
    // (индекс * (ширина + отступ)) + половина ширины видео
    const gap = 30;
    const elementCenterInTrack =
      activeIndex * (activeVideo.offsetWidth + gap) +
      activeVideo.offsetWidth / 2;

    // 3. Вычисляем смещение: центр экрана минус центр элемента
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
            setActiveIndex((prev) => prev - 1);
          }}
          className={`${styles.button} ${styles.backButton}`}
        >
          <ArrowSVG className={styles.arrow} />
        </button>
        <div ref={videoContainer} className={styles.videoContainer}>
          {MOCKDATA.map((link, index) => {
            return (
              <video
                key={index}
                // ref={video}
                // onPlay={onTimeUpdate}
                className={clsx(`${styles.video}`, {
                  [`${styles.activeVideo}`]: index === activeIndex,
                })}
                src={link}
              />
            );
          })}
        </div>
        <button
          onClick={() => {
            setActiveIndex((prev) => prev + 1);
          }}
          className={`${styles.button} ${styles.forwardButton}`}
        >
          <ArrowSVG className={styles.arrow} />
        </button>
      </div>

      <div className={styles.progressBars}>
        <div className={styles.progressBarContainer}>
          <div ref={progressBar} className={styles.progressBar} />
        </div>
        <div className={styles.progressBarContainer}>
          <div ref={progressBar} className={styles.progressBar} />
        </div>
        <div className={`${styles.progressBarContainer}`}>
          <div ref={progressBar} className={styles.progressBar} />
        </div>
        <div className={styles.progressBarContainer}>
          <div ref={progressBar} className={styles.progressBar} />
        </div>
        <div className={styles.progressBarContainer}>
          <div ref={progressBar} className={styles.progressBar} />
        </div>
      </div>
    </section>
  );
};
