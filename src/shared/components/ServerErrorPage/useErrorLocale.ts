"use client";
import { useSyncExternalStore } from "react";
import { routing, type Locale } from "@/i18n/routing";
const subscribe = () => () => {};
const getLocale = (): Locale => {
  const segment = window.location.pathname.split("/")[1];
  return routing.locales.includes(segment as Locale) ? segment as Locale : routing.defaultLocale;
};
export function useErrorLocale() {
  return useSyncExternalStore(subscribe, getLocale, (): Locale => routing.defaultLocale);
}
