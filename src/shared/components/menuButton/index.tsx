"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./MenuButton.module.css";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MorphSVGPlugin);
}

const HAMBURGER_PATH =
  "M286 159H14q-13 1-14 10 1 10 14 11h272q13-1 14-11-1-9-14-10M286 79H14Q1 80 0 90q1 10 14 11h272q13-1 14-11-1-10-14-11M286 0H14Q1 1 0 11q1 9 14 10h272q13-1 14-10-1-10-14-11";

const CROSS_PATH =
  "M66 1Q63 2 61 5v8q-1 1 38 39l38 38-38 38Q60 166 61 167v8q4 7 11 4c2 0 5-3 40-38l38-38 37 38 40 38a9 9 0 0 0 13-11l-39-40-38-38 38-38 39-40c2-8-6-15-13-11l-40 38-37 38-38-38C77 4 74 1 72 1z";

export const MenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const morphPathRef = useRef<SVGPathElement | null>(null);

  const { contextSafe } = useGSAP({ scope: svgRef });

  const toggleMenu = contextSafe(() => {
    if (!morphPathRef.current) return;

    const nextState = !isOpen;

    gsap.to(morphPathRef.current, {
      duration: 0.4,
      morphSVG: nextState ? CROSS_PATH : HAMBURGER_PATH,
      ease: "power2.inOut",
    });

    setIsOpen(nextState);
  });

  return (
    <button
      className={styles.menuButton}
      onClick={toggleMenu}
      aria-expanded={isOpen}
      aria-label="Toggle menu"
    >
      <Image src="/Menu.svg" alt="Menu" width={31} height={11} />
      <svg
        ref={svgRef}
        className={styles.burgerSvg}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="12"
        viewBox="0 0 300 180"
      >
        <path ref={morphPathRef} fill="#ffffff" d={HAMBURGER_PATH} />
      </svg>
    </button>
  );
};
