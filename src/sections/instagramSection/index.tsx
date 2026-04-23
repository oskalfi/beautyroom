"use client";

import { SyntheticEvent, useRef } from "react";
import styles from "./InstagramSection.module.css";

export function InstagramSection() {
  const progressBar = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);

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
      <div className={styles.gallery}>
        <div className={styles.videoWrapper}>
          <video
            ref={video}
            onPlay={onTimeUpdate}
            id="video"
            controlsList="play notimeline volume"
            controls
            className={styles.video}
            src="/video/guinot.mp4"
          />
          <div className={styles.progressBarContainer}>
            <div ref={progressBar} className={styles.progressBar} />
          </div>
        </div>
      </div>
    </section>
  );
}
