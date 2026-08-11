import { useEffect, useRef } from "react";
import styles from "./SoundHint.module.css";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";

export const SoundHint = ({
  isActive,
  hintTrigger,
}: {
  isActive: boolean;
  hintTrigger: number;
}) => {
  const hintTextRef = useRef<HTMLParagraphElement>(null);
  const volumeRef = useRef<SVGSVGElement>(null);
  const ripple1Ref = useRef<HTMLDivElement>(null);
  const ripple2Ref = useRef<HTMLDivElement>(null);

  const hintTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!isActive) return;

    if (!hintTextRef.current || !volumeRef.current) return;

    const split = SplitText.create(hintTextRef.current, {
      type: "chars lines",
    });

    const tl = gsap.timeline({
      paused: true,
    });

    tl.to(ripple1Ref.current, {
      delay: 1,
      ease: "linear",
      keyframes: [
        {
          duration: 0.1,
          opacity: 1,
        },
        {
          duration: 0.4,
          scale: 1.2,
          opacity: 0,
        },
      ],
    })
      .to(
        ripple2Ref.current,
        {
          ease: "linear",
          keyframes: [
            {
              duration: 0.52,
              scale: 1.2,
              opacity: 1,
            },
            {
              duration: 2,
            },
          ],
        },
        "<+=.2",
      )
      .fromTo(
        split.chars,

        {
          xPercent: -40,

          opacity: 0,
        },

        {
          xPercent: 0,

          opacity: 1,

          duration: 0.35,

          stagger: 0.008,

          ease: "power2.out",

          force3D: true,
        },

        "<",
      )
      .fromTo(
        volumeRef.current,

        {
          scale: 0.85,

          opacity: 0,
        },

        {
          scale: 1,

          opacity: 1,

          duration: 0.4,

          ease: "power2.out",

          force3D: true,
        },

        "<",
      )
      .to(ripple2Ref.current, {
        duration: 0.26,
        opacity: 0,
      })
      .to(
        split.chars,
        {
          xPercent: 40,
          yPercent: -40,
          opacity: 0,
          duration: 0.2,
          stagger: 0.008,
          ease: "power2.in",
          force3D: true,
        },
        "<",
      )
      .to(
        volumeRef.current,
        {
          scale: 0.85,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          force3D: true,
        },
        "<",
      );

    hintTl.current = tl;

    return () => {
      tl.kill();
      split.revert();
      hintTl.current = null;
    };
  }, [isActive]);

  // Запоминаем значение триггера, с которым компонент был смонтирован
  const prevHintTrigger = useRef(hintTrigger);

  useEffect(() => {
    if (!isActive) return;

    // Запускаем анимацию только если hintTrigger реально изменился
    // по сравнению с предыдущим известным значением
    if (prevHintTrigger.current !== hintTrigger) {
      hintTl.current?.restart();
      prevHintTrigger.current = hintTrigger; // обновляем реф новым значением
    }
  }, [hintTrigger, isActive]);

  return (
    <div className={styles.hint}>
      <div ref={ripple1Ref} className={styles.ripple} />
      <div ref={ripple2Ref} className={styles.ripple} />

      <div className={styles.wrapper}>
        <svg
          ref={volumeRef}
          className={styles.volumeSvg}
          width="90"
          height="82"
          viewBox="0 0 800 722"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M490.323 0V52.9801C641.858 82.1672 748.387 205.754 748.387 360.903C748.387 515.174 645.161 634.684 490.323 668.826V721.832C665.187 696.232 800 545.238 800 360.903C800 176.567 665.187 25.5742 490.323 0ZM361.29 51.2254L180.645 171.664V550.142L361.29 670.58C389.781 670.58 412.903 647.458 412.903 618.967V102.838C412.903 74.348 389.781 51.2254 361.29 51.2254ZM645.161 360.903C645.161 269.987 577.755 195.484 490.323 182.864V234.477C549.213 246.426 593.548 298.477 593.548 360.903C593.548 423.329 549.213 475.38 490.323 487.328V538.941C577.755 526.322 645.161 451.819 645.161 360.903ZM0 257.677V464.129C0 492.619 23.1226 515.742 51.6129 515.742H129.032V206.064H51.6129C23.1226 206.064 0 229.187 0 257.677Z"
          />
        </svg>
        <div ref={hintTextRef} className={styles.hintText}>
          Активируйте звук двойным нажатием
        </div>
      </div>
    </div>
  );
};
