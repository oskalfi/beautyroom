import clsx from "clsx";
import styles from "./CarouselItem.module.css";
import { useEffect, useRef } from "react";
import { generateRoundedRectPath } from "./generateRoundedRectPath";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

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

  const hintTextRef = useRef<HTMLParagraphElement>(null);
  const volumeRef = useRef<SVGSVGElement>(null);
  const ripple1Ref = useRef<HTMLDivElement>(null);
  const ripple2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!hintTextRef.current || !volumeRef.current) return;

    const split = SplitText.create(hintTextRef.current, {
      type: "chars lines",
    });

    const tl = gsap.timeline({
      repeat: -1,

      repeatDelay: 2,
    });

    tl.from(split.chars, {
      delay: 1,
      xPercent: -40,
      opacity: 0,
      duration: 0.35,
      stagger: 0.008,
      ease: "power2.out",
      force3D: true,
    }).from(
      volumeRef.current,
      {
        scale: 0.85,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        force3D: true,
      },
      "<",
    );

    tl.to(split.chars, {
      delay: 1.8,
      xPercent: 40,
      yPercent: -40,
      opacity: 0,
      duration: 0.3,
      stagger: 0.008,
      ease: "power2.in",
      force3D: true,
    }).to(
      volumeRef.current,
      {
        scale: 0.85,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        force3D: true,
      },
      "<",
    );

    return () => {
      split.revert();
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
        {isActive && (
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
        )}

        <video
          loop={isActive}
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
