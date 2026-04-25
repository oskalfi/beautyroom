"use client";

import { SyntheticEvent, useRef } from "react";
import styles from "./InstagramSection.module.css";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

export function InstagramSection() {
  const progressBar = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const videoContainer = useRef<HTMLDivElement | null>(null);

  function updateProgress() {
    const vid = video.current;
    const bar = progressBar.current;
    if (!vid || !bar) return;
    if (!vid.paused && !vid.ended) {
      const percentage = -100 + (vid.currentTime / vid.duration) * 100;
      bar.style.transform = `translateX(${percentage}%)`;
      requestAnimationFrame(updateProgress);
    }
  }

  function onTimeUpdate(e: SyntheticEvent<HTMLVideoElement>) {
    requestAnimationFrame(updateProgress);
  }

  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.heading}>Остаёмся на связи</h2>
      <div ref={videoContainer} className={styles.videoContainer}>
        <button
          onClick={() => {
            videoContainer.current?.scrollBy({
              left: -300,
              behavior: "smooth",
            });
          }}
          className={`${styles.button} ${styles.backButton}`}
        >
          <ArrowSVG className={styles.arrow} />
        </button>

        <video src="/video/pacan.mp4" className={styles.video} />
        <video
          ref={video}
          onPlay={onTimeUpdate}
          className={styles.video}
          src="/video/guinot.mp4"
        />
        <video src="/video/jetpeel.mp4" className={`${styles.video}`} />
        <video src="/video/outside.mp4" className={styles.video} />
        <video src="/video/alena.mp4" className={styles.video} />
        <video src="/video/alena.mp4" className={styles.video} />

        <video src="/video/alena.mp4" className={styles.video} />
        <video src="/video/alena.mp4" className={styles.video} />
        <video src="/video/alena.mp4" className={styles.video} />
        <video src="/video/alena.mp4" className={styles.video} />
        <video src="/video/alena.mp4" className={styles.video} />

        <button
          onClick={() => {
            videoContainer.current?.scrollBy({
              left: 300,
              behavior: "smooth",
            });
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
}
