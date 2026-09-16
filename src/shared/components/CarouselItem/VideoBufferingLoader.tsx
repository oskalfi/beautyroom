import { useEffect, useState, type RefObject } from "react";
import { MediaLoader } from "../MediaLoader";

const BUFFERING_DELAY_MS = 1000;

// Mounted only while the visible, active video is waiting for data.
// Short startup delays never display a spinner; unmounting cancels the timer.
export function VideoBufferingLoader({
  videoRef,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.error && video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        setShowLoader(true);
      }
    }, BUFFERING_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [videoRef]);

  return showLoader ? <MediaLoader label="Загрузка видео" /> : null;
}
