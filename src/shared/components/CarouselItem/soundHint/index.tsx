import { useEffect, useRef } from "react";
import styles from "./SoundHint.module.css";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";
import Image from "next/image";

export const SoundHint = ({
  isActive,
  hintTrigger,
  soundIconRef,
  soundEnabled,
}: {
  isActive: boolean;
  hintTrigger: number;
  soundIconRef: React.RefObject<HTMLImageElement | null>;
  soundEnabled: boolean;
}) => {
  const hintTextRef = useRef<HTMLParagraphElement>(null);
  const ripple1Ref = useRef<HTMLDivElement>(null);
  const ripple2Ref = useRef<HTMLDivElement>(null);

  const hintTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!isActive) return;

    if (!hintTextRef.current || !soundIconRef.current) return;

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
        soundIconRef.current,
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
        soundIconRef.current,
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
    console.log(soundEnabled);

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
        <div ref={soundIconRef} className={styles.soundIcon}>
          <Image
            style={{ display: soundEnabled ? "block" : "none" }}
            src="/volume.svg"
            width={90}
            height={82}
            alt="Иконка звука"
            className={styles.volumeSvg}
          />
          <Image
            style={{ display: soundEnabled ? "none" : "block" }}
            src="/volume_mute.svg"
            width={90}
            height={82}
            alt="Иконка выключеного звука"
            className={styles.volumeSvg}
          />
        </div>

        <div ref={hintTextRef} className={styles.hintText}>
          Активируйте звук двойным нажатием
        </div>
      </div>
    </div>
  );
};
