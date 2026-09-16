"use client";
import { useRef, type ComponentProps } from "react";
import { useNearViewport } from "@/shared/hooks/useNearViewport";

export function LazyImage({ src, srcSet, ref, alt, ...props }: ComponentProps<"img">) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const near = useNearViewport(imageRef);
  // Native images allow an explicit preparation distance for existing layouts.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={alt} ref={(element) => {
    imageRef.current = element;
    if (typeof ref === "function") return ref(element);
    if (ref) ref.current = element;
  }} src={near ? src : undefined} srcSet={near ? srcSet : undefined} decoding="async" />;
}
