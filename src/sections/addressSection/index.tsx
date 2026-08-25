"use client";

import Image from "next/image";
import styles from "./AddressSection.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export const AddressSection = () => {
  const addressRef = useRef<HTMLElement | null>(null);
  const rectRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!addressRef.current) return;
      const pulse = gsap.timeline({
        repeat: -1,
        repeatDelay: 6,
      });

      pulse.to(addressRef.current, {
        scale: 1.1,
        duration: 0.15,
        ease: "power2.out",
        repeat: 3,
        yoyo: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: addressRef.current,
          start: "bottom 99.9%",
          toggleActions: "restart pause restart pause",
        },
      });

      tl.delay(1).add(pulse);

      const rect = rectRef.current as any;
      if (!rect) return;
      const length = rect.getTotalLength();
      gsap.set(rect, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });

      const headingStroke = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      headingStroke
        .to(rect, { opacity: 1, duration: 0.05 })
        .to(rect, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power4.in",
        })
        .to(rect, {
          strokeDashoffset: -length, // Линия уходит дальше вперед на всю длину
          duration: 0.6,
          ease: "power2.out",
        })
        .to(rect, { opacity: 0, duration: 0.05 }, "-=0.05");
    },
    { scope: containerRef },
  );

  return (
    <section className={styles.section}>
      <div className={styles.headerWrapper} ref={containerRef}>
        <h2 className={styles.heading}>Расположение</h2>

        <svg className={styles.borderSvg}>
          <rect
            ref={rectRef}
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="16"
            className={styles.borderRect}
          />
        </svg>
      </div>

      <a
        href="https://waze.com/ul?q=Jerusalem%20Blvd%2033%2C%20Tel%20Aviv-Yafo&navigate=yes"
        className={styles.contentWrapper}
      >
        <div className={styles.plateWrapper}>
          <div className={styles.plate}>
            <div className={styles.plateContent}>
              <Image
                className={styles.logo}
                src="/logoKY.svg"
                alt="Logo"
                width={230}
                height={230}
              />
            </div>
            <div className={styles.stickerBack}></div>
          </div>
        </div>

        <address className={styles.address} ref={addressRef}>
          <img src="/waze.svg" alt="Waze icon" className={styles.wazeIcon} />
          Jerusalem Blvd 33, Tel Aviv-Yafo
        </address>
      </a>
      <img className={styles.map} src="/map.png" alt="Map" />
    </section>
  );
};
