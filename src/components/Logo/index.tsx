import { BeautyRoomSVG } from "@/shared/assets/svg/BeautyRoom";
import { SilhouetteSVG } from "@/shared/assets/svg/Silhouette";
import styles from "./Logo.module.css";

type LogoProps = {
  className?: string;
  textClassName?: string;
  silhouetteClassName?: string;
};

export function Logo({ className, textClassName, silhouetteClassName }: LogoProps) {
  return (
    <span className={className ?? styles.logo} aria-hidden="true">
      <BeautyRoomSVG className={textClassName ?? styles.text} />
      <SilhouetteSVG className={silhouetteClassName ?? styles.silhouette} />
    </span>
  );
}
