"use client";

import { LiquidGlass } from "simple-liquid-glass";
import type { RefObject } from "react";

export default function WelcomeGlassSurface({ backdropRef }: { backdropRef: RefObject<HTMLDivElement | null> }) {
  return (
    <LiquidGlass
      backdropRef={backdropRef}
      renderer="webgl"
      quality="standard"
      mode="custom"
      lensProfile="player"
      lensOptions={{ strength: 0.12, depth: 0.2, curvature: 0.45, sheen: 0.35, sheenWidth: 1, glow: 0 }}
      radius={999}
      blur={4}
      iosMinBlur={4}
      saturation={105}
      dispersion={50}
      aberrationIntensity={0.08}
      frost={0.06}
      glassColor="rgba(255,255,255,0.06)"
      borderColor="rgba(255,255,255,0.6)"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
