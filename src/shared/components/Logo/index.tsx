import type { SVGProps } from "react";
import { BeautyRoomSVG } from "@/shared/assets/svg/BeautyRoom";
import { SilhouetteSVG } from "@/shared/assets/svg/Silhouette";
import styles from "./Logo.module.css";

type LogoProps = {
  className?: string;
  textClassName?: string;
  silhouetteClassName?: string;
};

// SVG-only composition for nesting inside other vector graphics.
export function LogoSVG(props: Omit<SVGProps<SVGSVGElement>, "children" | "dangerouslySetInnerHTML">) {
  return (
    <svg width="254" height="119" viewBox="0 0 254 119" fill="currentColor" aria-hidden="true" {...props}>
      <g transform="translate(0 48)">
        <BeautyRoomSVG className="" />
      </g>
      <g transform="translate(118 0)">
        <SilhouetteSVG className="" />
      </g>
    </svg>
  );
}

export function Logo({ className, textClassName, silhouetteClassName }: LogoProps) {
  return (
    <span className={className ?? styles.logo} aria-hidden="true">
      <BeautyRoomSVG className={textClassName ?? styles.text} />
      <SilhouetteSVG className={silhouetteClassName ?? styles.silhouette} />
    </span>
  );
}
