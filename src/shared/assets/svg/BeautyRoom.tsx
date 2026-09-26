type BeautyRoomSVGProps = {
  className: string;
};

// Reuse cached vector paths instead of serializing them into every React tree.
export const BeautyRoomSVG = ({ className }: BeautyRoomSVGProps) => (
  <svg className={className} width="254" height="63" viewBox="0 0 254 63" fill="currentColor" aria-hidden="true">
    <use href="/icons/beauty-room-wordmark.svg#art" />
  </svg>
);
