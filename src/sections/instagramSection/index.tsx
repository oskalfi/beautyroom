"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./InstagramSection.module.css";
import { ArrowSVG } from "@/shared/assets/svg/Arrow";

import { MOCKDATA } from "./mockData";
import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

export const InstagramSection = () => {
  const videoContainer = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(
    Math.floor((MOCKDATA.length - 1) / 2),
  );

  const track = useRef<HTMLDivElement>(null);

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

    container.style.transform = `matrix(1, 0, 0, 1, ${translateX}, 0)`;
  }, [activeIndex]);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `.${styles.videoContainer}`,
        start: "25% bottom",
        once: true,
      },
    });

    tl.from(videoContainer.current!.children, {
      y: "-10%",
      duration: 2.5,
      stagger: 0.1,
      ease: "elastic",
    }).from(
      videoContainer.current!.children,
      {
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      },
      "<",
    );

    gsap.to(videoContainer.current, {
      opacity: 1,
      duration: 2,
      scrollTrigger: {
        trigger: `.${styles.videoContainer}`,
        start: "25% bottom",
        once: true,
      },
    });
  }, []);

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
        <div ref={track} className={styles.track}></div>
        <div ref={videoContainer} className={styles.videoContainer}>
          {MOCKDATA.map((link, index) => {
            return (
              <div key={index} className={styles.videoScaleWrapper}>
                <video
                  className={clsx(
                    { [styles.activeVideo]: index === activeIndex },
                    styles.video,
                  )}
                  src={link}
                />
              </div>
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
