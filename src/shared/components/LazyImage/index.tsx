"use client";
import { useRef, type ComponentProps } from "react";
import { getImageProps } from "next/image";
import { useNearViewport } from "@/shared/hooks/useNearViewport";

type LazyImageProps = ComponentProps<"img"> & { quality?: number };

export function LazyImage({ src, srcSet, ref, alt, width, height, sizes, quality = 85, ...props }: LazyImageProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const near = useNearViewport(imageRef);
  // Raster images use Next's responsive optimizer; SVGs remain vectors.
  // Keep the existing 1000px preparation margin and DOM ref used by animations.
  const raster = typeof src === "string" && /\.(png|jpe?g|webp|avif)$/i.test(src);
  const optimized = raster && width && height && !srcSet
    ? getImageProps({ src: src as string, alt: alt ?? "", width: Number(width), height: Number(height), sizes, quality }).props
    : undefined;
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} width={width} height={height} sizes={sizes} alt={alt} ref={(element) => {
    imageRef.current = element;
    if (typeof ref === "function") return ref(element);
    if (ref) ref.current = element;
  }} src={near ? optimized?.src ?? src : undefined}
    srcSet={near ? optimized?.srcSet ?? srcSet : undefined} decoding="async" />;
}
