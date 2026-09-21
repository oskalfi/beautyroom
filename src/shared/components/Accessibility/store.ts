"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";

export const defaults = {
  textScale: 100, lineSpacing: false, letterSpacing: false, readableFont: false,
  contrast: "normal" as "normal" | "dark" | "light" | "invert" | "mono",
  underline: false, headings: false, motion: null as boolean | null,
  cursor: "normal" as "normal" | "black" | "white", ruler: false, keyboard: false,
};
export type Settings = typeof defaults;
export const useAccessibility = create<Settings & {
  update: (value: Partial<Settings>) => void; reset: () => void;
}>()(persist(set => ({ ...defaults, update: value => set(value), reset: () => set(defaults) }), {
  name: "beauty-room-accessibility", version: 1,
  partialize: state => Object.fromEntries(Object.keys(defaults).map(key => [key, state[key as keyof Settings]])),
}));
const subscribe = (listener: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
export function useMotionStopped() {
  const preference = useAccessibility(state => state.motion);
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  return preference ?? reduced;
}
