"use client";

import Image from "next/image";
import styles from "./AddressSection.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export const AddressSection = () => {
  const headingRef = useRef(null);
  const rectRef = useRef(null);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const addressRef = useRef(null);

  useGSAP(
    () => {
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
          duration: 0.5,
          ease: "power4.in",
        })
        .to(rect, {
          strokeDashoffset: -length, // Линия уходит дальше вперед на всю длину
          duration: 0.5,
          ease: "power2.out",
        })
        .to(rect, { opacity: 0, duration: 0.05 }, "-=0.05")
        .from(
          mapRef.current,
          {
            opacity: 0,
            duration: 3,
          },
          "<-=0.3",
        )
        .from(
          addressRef.current,
          {
            opacity: 0,
            duration: 3,
          },
          "<+=0.5",
        );
    },
    { scope: containerRef },
  );

  return (
    <section className={styles.section}>
      <div className={styles.headerWrapper} ref={containerRef}>
        <h2 className={styles.heading} ref={headingRef}>
          Расположение
        </h2>

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
        ref={addressRef}
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

        <address className={styles.address}>
          <img src="/waze.svg" alt="Waze icon" className={styles.wazeIcon} />
          Jerusalem Blvd 33, Tel Aviv-Yafo
        </address>
      </a>
      <img className={styles.map} src="/map.png" alt="Map" ref={mapRef} />
    </section>
  );
};
