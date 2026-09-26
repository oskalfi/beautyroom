type FingerprintSVGProps = {
  className: string;
};

// Reuse cached vector paths instead of serializing them into every React tree.
export const FingerprintSVG = ({ className }: FingerprintSVGProps) => (
  <svg className={className} width="112" height="126" viewBox="0 0 112 126" fill="currentColor" aria-hidden="true">
    <use href="/icons/fingerprint.svg#art" />
  </svg>
);
