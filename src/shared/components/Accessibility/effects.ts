"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAccessibility, useMotionStopped } from "./store";

export function useAccessibilityEffects() {
  const settings = useAccessibility();
  const stopped = useMotionStopped();
  useEffect(() => {
    const root = document.documentElement;
    const values = { contrast: settings.contrast, readable: settings.readableFont, lines: settings.lineSpacing,
      letters: settings.letterSpacing, underline: settings.underline, headings: settings.headings,
      cursor: settings.cursor, keyboard: settings.keyboard, motion: stopped };
    for (const [key, value] of Object.entries(values)) root.setAttribute(`data-a11y-${key}`, String(value));
    return () => { for (const key of Object.keys(values)) root.removeAttribute(`data-a11y-${key}`); };
  }, [settings.contrast, settings.readableFont, settings.lineSpacing, settings.letterSpacing, settings.underline,
    settings.headings, settings.cursor, settings.keyboard, stopped]);

  useEffect(() => {
    if (settings.textScale === 100) return;
    // Resolve all aliases before changing anything so font tokens are scaled once.
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const values = Array.from(computed).filter(key => key.startsWith("--") && key !== "--font-size-root" &&
      (/font-size|hero-h|(?:text|title|heading|lead|eyebrow|button|arrow)-size/.test(key)))
      .map(key => [key, computed.getPropertyValue(key).trim()] as const)
      .filter(([, value]) => /\d(?:px|rem|em|vw|vh)|calc\(|clamp\(/.test(value));
    const previous = values.map(([key]) => [key, root.style.getPropertyValue(key)]);
    for (const [key, value] of values) root.style.setProperty(key, `calc((${value}) * ${settings.textScale / 100})`);
    root.setAttribute("data-a11y-scaled", "true");
    return () => {
      for (const [key, value] of previous) { if (value) root.style.setProperty(key, value); else root.style.removeProperty(key); }
      root.removeAttribute("data-a11y-scaled");
    };
  }, [settings.textScale]);

  useEffect(() => {
    if (!stopped) return;
    const paused = new Set<gsap.core.Animation>();
    const triggers = new Set<ScrollTrigger>();
    const finished = new WeakSet<gsap.core.Animation>();
    const svgAnimations = new Set<SVGSVGElement>();
    const gifs = new Map<HTMLImageElement, {src: string; srcset: string | null}>();
    const freeze = () => {
      document.querySelectorAll<SVGSVGElement>("svg").forEach(svg => {
        if (svg.querySelector("animate, animateTransform, animateMotion, set") && !svgAnimations.has(svg)) {
          svgAnimations.add(svg); svg.pauseAnimations();
        }
      });
      for (const trigger of ScrollTrigger.getAll()) if ((trigger as ScrollTrigger & { enabled?: boolean }).enabled !== false && !triggers.has(trigger)) {
        triggers.add(trigger); trigger.disable(false, false);
      }
      for (const animation of gsap.globalTimeline.getChildren(true, true, true)) {
        if (animation.repeat() === -1) {
          if (!animation.paused()) { paused.add(animation); animation.pause(); }
        } else if (!finished.has(animation)) {
          finished.add(animation); animation.totalProgress(1);
        }
      }
    };
    const pauseVideo = (event: Event) => { if (event.target instanceof HTMLVideoElement) event.target.pause(); };
    const freezeImages = () => {
      document.querySelectorAll<HTMLImageElement>('img').forEach(img => {
        if (!/\.gif(?:$|\?)/i.test(img.currentSrc || img.src) || !img.complete || !img.naturalWidth || gifs.has(img)) return;
        const canvas = document.createElement("canvas"); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        let still: string;
        try {
          canvas.getContext("2d")?.drawImage(img, 0, 0);
          still = canvas.toDataURL();
        } catch {
          // A remote GIF without CORS cannot be sampled; use a static placeholder.
          still = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="100%" height="100%" fill="white"/><text x="160" y="90" text-anchor="middle" fill="black" font-size="16">Анимация остановлена</text></svg>');
        }
        gifs.set(img, { src: img.getAttribute("src") ?? "", srcset: img.getAttribute("srcset") });
        img.removeAttribute("srcset"); img.src = still;
      });
    };
    document.querySelectorAll("video").forEach(video => video.pause());
    document.addEventListener("play", pauseVideo, true);
    document.addEventListener("load", freezeImages, true);
    freeze(); freezeImages();
    gsap.ticker.add(freeze);
    return () => {
      gsap.ticker.remove(freeze);
      document.removeEventListener("play", pauseVideo, true);
      document.removeEventListener("load", freezeImages, true);
      for (const svg of svgAnimations) svg.unpauseAnimations();
      for (const animation of paused) animation.resume();
      for (const trigger of triggers) {
        if (ScrollTrigger.getAll().includes(trigger)) trigger.enable();
      }
      for (const [img, old] of gifs) { img.src = old.src; if (old.srcset !== null) img.srcset = old.srcset; }
    };
  }, [stopped]);

  useEffect(() => {
    if (!settings.keyboard) return;
    const navigate = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !["ArrowDown", "ArrowUp"].includes(event.key)) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"], [role="slider"], [role="combobox"], [role="listbox"], dialog')) return;
      const elements = Array.from(document.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]'))
        .filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== "hidden" && !el.closest('[inert], [aria-hidden="true"]'));
      const index = elements.indexOf(target);
      const next = elements[index + (event.key === "ArrowDown" ? 1 : -1)];
      if (next) { event.preventDefault(); next.focus(); }
    };
    document.addEventListener("keydown", navigate);
    return () => document.removeEventListener("keydown", navigate);
  }, [settings.keyboard]);
}
