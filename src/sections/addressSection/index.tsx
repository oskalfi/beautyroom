"use client";
import { useLocale, useTranslations } from "next-intl";

import { LazyImage } from "@/shared/components/LazyImage";

import Image from "next/image";
import styles from "./AddressSection.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export const AddressSection = () => {
  const t = useTranslations("Home");
  const locale = useLocale();
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.6117815743755!2d34.75951190000001!3d32.052698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4da6a466a909%3A0xf522fa774f394f73!2sBeauty%20Room%20by%20Yael%20Kanter!5e0!3m2!1s${locale}!2sil!4v1791362469461!5m2!1s${locale}!2sil`;
  const headingRef = useRef(null);
  const rectRef = useRef<SVGRectElement>(null);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const addressRef = useRef(null);

  useGSAP(
    () => {
      const rect = rectRef.current;
      if (!rect) return;
      const length = rect.getTotalLength();
      // Keep offsets positive: WebKit can jump when an SVG dash offset crosses zero.
      // With a dash and gap of equal length, 3L -> 2L -> L is equivalent to L -> 0 -> -L.
      gsap.set(rect, {
        strokeDasharray: `${length} ${length}`,
        strokeDashoffset: length * 3,
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
        .fromTo(
          headingRef.current,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 1,
          },
        )
        .to(rect, { opacity: 1, duration: 0.05 }, 0)
        .to(
          rect,
          {
            strokeDashoffset: length * 2,
            duration: 0.5,
            ease: "power4.in",
          },
          0,
        )
        .to(rect, {
          strokeDashoffset: length,
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
          0.5,
        )
        .from(
          addressRef.current,
          {
            opacity: 0,
            duration: 3,
          },
          "<+=0.3",
        );
    },
    { scope: containerRef },
  );

  return (
    <section className={styles.section}>
      <div className={styles.headerWrapper} ref={containerRef}>
        <h2 className={styles.heading} ref={headingRef}>
          {t("addressTitle")}
        </h2>

        <svg className={styles.borderSvg}>
          <rect
            ref={rectRef}
            x="1"
            y="1"
            rx="16"
            className={styles.borderRect}
          />
        </svg>
      </div>

      <a
        data-press-feedback
        aria-label={t("waze")}
        target="_blank"
        href="https://waze.com/ul?q=Jerusalem%20Blvd%2033%2C%20Tel%20Aviv-Yafo&navigate=yes"
        className={styles.contentWrapper}
        ref={addressRef}
      >
        <div className={styles.plateWrapper}>
          <div className={styles.plate}>
            <div className={styles.plateContent}>
              <Image
                className={styles.logo}
                src="/logoKY-920.svg"
                sizes="(max-width: 480px) 150px, (max-width: 768px) 180px, 230px"
                quality={90}
                alt={t("signAlt")}
                width={230}
                height={230}
              />
            </div>
            <div className={styles.stickerBack}></div>
          </div>
        </div>

        <address className={styles.address}>
          <LazyImage
            src="/waze.svg"
            alt="Waze icon"
            className={styles.wazeIcon}
          />
          {t("address")}
        </address>
      </a>
      <div className={styles.mapWrapper} ref={mapRef}>
        <iframe
          src={mapUrl}
          title={t("mapAlt")}
          width="815"
          height="500"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className={styles.map}
        />
        <a
          className={styles.mapLink}
          dir="auto"
          href="https://maps.app.goo.gl/WLxLtpTQESe6Jx4C7"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("maps")}
        </a>
      </div>
    </section>
  );
};
