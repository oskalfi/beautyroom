import clsx from "clsx";
import styles from "./CarouselItem.module.css";
import { useEffect, useRef } from "react";

type TCarouselItem = {
  link: string;
  isActive: boolean;
};

export const CarouselItem = ({ link, isActive }: TCarouselItem) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rectRef = useRef<SVGRectElement | null>(null);
  const totalRectLength = useRef(0);

  const isRunning = useRef(false);

  const update = (_now: number, metadata: VideoFrameCallbackMetadata) => {
    const rect = rectRef.current;
    const video = videoRef.current;

    if (!rect || !video || !video.duration || !isRunning.current) return;

    const progressPercent = metadata.mediaTime / video.duration;

    const offset = (1 - progressPercent) * totalRectLength.current;

    rect.style.strokeDashoffset = `${offset}`;

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

    if (!rectRef.current) return;
    rectRef.current.style.strokeDashoffset = "0";
  }

  useEffect(() => {
    if (!rectRef.current) return;
    totalRectLength.current = rectRef.current.getTotalLength();
    rectRef.current.style.strokeDasharray = `${totalRectLength.current}`;
    rectRef.current.style.strokeDashoffset = `${totalRectLength.current}`;

    return () => {
      stopLoop();
    };
  }, []);

  return (
    <div className={styles.mediaWrapper}>
      <div
        className={clsx(
          { [styles.activeMedia]: isActive },
          styles.videoWrapper,
        )}
      >
        <video
          controls
          autoPlay
          ref={videoRef}
          className={styles.media}
          src={link}
          onPlay={startLoop}
          onPause={stopLoop}
          onEnded={handleEnded}
        />
        {/*video progress bar*/}
        <svg
          className={clsx(styles.border, {
            [styles.isVisible]: isActive,
          })}
        >
          <rect
            ref={rectRef}
            x="2.5"
            y="2.5"
            width="calc(100% - 5px)"
            height="calc(100% - 5px)"
            rx="27.5"
            ry="27.5"
          />
        </svg>
      </div>
    </div>
  );
};
