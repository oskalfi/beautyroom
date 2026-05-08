import clsx from "clsx";
import styles from "./CarouselItem.module.css";
import { useEffect, useRef } from "react";
import { generateRoundedRectPath } from "./generateRoundedRectPath";

type TCarouselItem = {
  link: string;
  isActive: boolean;
};

export const CarouselItem = ({ link, isActive }: TCarouselItem) => {
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
    if (!pathRef.current) return;
    totalPathLength.current = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${totalPathLength.current}`;
    pathRef.current.style.strokeDashoffset = `${totalPathLength.current}`;

    return () => {
      stopLoop();
    };
  }, [isActive]);

  return (
    <div className={styles.mediaWrapper}>
      <div
        className={clsx(
          { [styles.activeMedia]: isActive },
          styles.videoWrapper,
        )}
      >
        <video
          muted
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
