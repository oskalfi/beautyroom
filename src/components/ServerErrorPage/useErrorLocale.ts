"use client";
import { useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/routing";
const subscribe = () => () => {};
const getLocale = (): Locale => {
  const segment = window.location.pathname.split("/")[1];
  return segment === "ru" || segment === "he" ? segment : "en";
};
export function useErrorLocale() {
  return useSyncExternalStore(subscribe, getLocale, (): Locale => "en");
}
