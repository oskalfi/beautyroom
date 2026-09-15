import clsx from "clsx";
import styles from "./CarouselItem.module.css";
import { useEffect, useRef } from "react";
import { generateRoundedRectPath } from "./generateRoundedRectPath";
import { SoundHint } from "./soundHint";
import gsap from "gsap/all";

type TCarouselItem = {
  link: string;
  isActive: boolean;
  isVisible: boolean;
  ref: React.Ref<HTMLDivElement>;
  index: number;
  hintTrigger: number;
  soundEnabled: boolean;
  onEnableSound: () => void;
};

export const CarouselItem = ({
  link,
  isActive,
  isVisible,
  ref,
  index,
  hintTrigger,
  soundEnabled,
  onEnableSound,
}: TCarouselItem) => {
  const volumeRef = useRef<HTMLImageElement>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isRunning = useRef(false);

  const pathRef = useRef<SVGRectElement | null>(null);
  const totalPathLength = useRef(0);

  const update = (_now: number, metadata: VideoFrameCallbackMetadata) => {
    const path = pathRef.current;
    const video = videoRef.current;
    if (!path || !video || !video.duration || !isRunning.current) return;

    const progressPercent = metadata.mediaTime / video.duration;
    const offset = (1 - progressPercent) * totalPathLength.current;
    path.style.strokeDashoffset = `${offset}`;
    video.requestVideoFrameCallback(update);
  };

  function startLoop() {
    if (!videoRef.current || isRunning.current) return;
    isRunning.current = true;
    videoRef.current.requestVideoFrameCallback(update);
  }

  function stopLoop() {
    isRunning.current = false;
  }

  function handleEnded() {
    stopLoop();
    if (!pathRef.current) return;
    pathRef.current.style.strokeDashoffset = "0";
  }

  const lastClickTime = useRef(0);
  const DOUBLE_CLICK_DELAY = 300; // Окно времени в миллисекундах
  const tl = gsap.timeline();

  const handleVideoClick = () => {
    if (!isActive || !videoRef.current) return;

    const currentTime = Date.now();
    const timeDifference = currentTime - lastClickTime.current;

    if (timeDifference < DOUBLE_CLICK_DELAY && timeDifference > 0) {
      // Сработал двойной тап / клик
      videoRef.current.muted = false;
      onEnableSound();
      // Сбрасываем таймер, чтобы тройной клик не засчитался как два двойных
      lastClickTime.current = 0;
      tl.fromTo(
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
        },
      ).to(
        volumeRef.current,
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.4,
          ease: "power2.in",
        },
        "+=1",
      );
    } else {
      lastClickTime.current = currentTime;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive && isVisible) {
      void video.play().catch((error: unknown) => {
        // A pause/navigation can cancel a pending play; autoplay may be blocked.
        if (
          error instanceof DOMException &&
          (error.name === "AbortError" || error.name === "NotAllowedError")
        ) return;
        console.warn("Не удалось запустить видео карусели:", error);
      });
    } else {
      video.pause();
      if (!isActive) video.currentTime = 0;
    }

    return () => {
      video.pause();
      stopLoop();
    };
  }, [isActive, isVisible]);

  useEffect(() => {
    if (!pathRef.current) return;
    totalPathLength.current = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${totalPathLength.current}`;
    pathRef.current.style.strokeDashoffset = `${totalPathLength.current}`;

    return () => {
      stopLoop();
    };
  }, [isActive]);

  return (
    <div className={styles.mediaWrapper} onClick={handleVideoClick}>
      <div
        data-index={index}
        ref={ref}
        className={clsx(
          { [styles.activeMedia]: isActive },
          styles.videoWrapper,
        )}
      >
        {isActive && (
          <SoundHint
            hintTrigger={hintTrigger}
            isActive={isActive}
            soundIconRef={volumeRef}
            soundEnabled={soundEnabled}
          />
        )}

        <video
          loop={isActive}
          muted={!soundEnabled}
          playsInline
          ref={videoRef}
          className={styles.media}
          src={link}
          onPlay={startLoop}
          onPause={stopLoop}
          onEnded={handleEnded}
        />
        <svg
          className={clsx(styles.border, {
            [styles.isVisible]: isActive,
          })}
          viewBox={`0 0 ${360} ${640}`}
        >
          <path
            ref={pathRef}
            d={generateRoundedRectPath(360, 640, 30)}
            strokeWidth="5"
            stroke="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};
