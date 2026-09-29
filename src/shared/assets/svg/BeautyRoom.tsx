type BeautyRoomSVGProps = {
  className: string;
};

// Safari cannot reliably resolve filters inside an external <use> resource.
// Keep the cached paths external and apply each shadow in the host document.
export const BeautyRoomSVG = ({ className }: BeautyRoomSVGProps) => {
  const id = useId();
  const titleShadow = `${id}-title-shadow`;
  const nameShadow = `${id}-name-shadow`;
  return (
    <svg className={className} width="254" height="63" viewBox="0 0 254 63" fill="currentColor" aria-hidden="true">
      <defs>
        {[
          { id: titleShadow, x: ".8", y: "5.2", width: "252", height: "29.4" },
          { id: nameShadow, x: "150.1", y: "42.1", width: "104.4", height: "17.2" },
        ].map((filter) => (
          <filter key={filter.id} {...filter} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy=".5" />
            <feGaussianBlur stdDeviation=".5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend in2="BackgroundImageFix" result="shadow" />
            <feBlend in="SourceGraphic" in2="shadow" result="shape" />
          </filter>
        ))}
      </defs>
      <g filter={`url(#${titleShadow})`}>
        <use href="/icons/beauty-room-wordmark.svg?v=3#title" />
      </g>
      <g filter={`url(#${nameShadow})`}>
        <use href="/icons/beauty-room-wordmark.svg?v=3#name" />
      </g>
    </svg>
  );
};
import { useId } from "react";
