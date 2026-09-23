"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ConnectionPage } from "@/components/ConnectionPage";
import type { Locale } from "@/i18n/routing";
import styles from "./ConnectionGuard.module.css";

export function ConnectionGuard() {
  const locale = useLocale() as Locale;
  const dialog = useRef<HTMLDialogElement>(null);
  const retry = useRef<() => void>(() => {});
  const [checking, setChecking] = useState(false);
  useEffect(() => {
    const panel = dialog.current;
    let disposed = false;
    let controller: AbortController | undefined;
    let retryTimer: ReturnType<typeof setTimeout>;
    let reason: "offline" | "slow" | null = null;
    const show = (next: "offline" | "slow") => {
      reason = next;
      if (!panel?.open) panel?.showModal();
    };
    const hide = () => { reason = null; panel?.close(); };
    const probe = async (manual = false) => {
      if (controller) return;
      if (!navigator.onLine) { show("offline"); return; }
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 8000);
      setChecking(true);
      try {
        const response = await fetch("/api/connection", { cache: "no-store", signal: controller.signal });
        if (disposed) return;
        if (response.status === 204) {
          if (manual) window.location.reload();
          else if (reason === "offline") hide();
        } else show("slow");
      } catch {
        if (!disposed) show(navigator.onLine ? "slow" : "offline");
      } finally {
        clearTimeout(timeout);
        controller = undefined;
        if (!disposed) setChecking(false);
      }
    };
    retry.current = () => { void probe(true); };
    const offline = () => show("offline");
    const online = () => { void probe(); };
    const slow = () => show("slow");
    const ready = () => { if (reason === "slow" && navigator.onLine) hide(); };
    const poll = () => {
      if (reason && document.visibilityState === "visible") void probe();
      retryTimer = setTimeout(poll, 10000);
    };
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    window.addEventListener("beauty:screen-slow", slow);
    window.addEventListener("beauty:screen-ready", ready);
    if (!navigator.onLine) offline();
    poll();
    // Never cache development bundles or interfere with hot reload.
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/connection-sw.js").catch(console.warn);
    }
    return () => {
      disposed = true;
      clearTimeout(retryTimer);
      controller?.abort();
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
      window.removeEventListener("beauty:screen-slow", slow);
      window.removeEventListener("beauty:screen-ready", ready);
      panel?.close();
    };
  }, []);
  return <dialog ref={dialog} className={styles.dialog} aria-label={locale === "ru" ? "Проблема с соединением" : locale === "he" ? "בעיה בחיבור" : "Connection problem"}>
    <ConnectionPage locale={locale} checking={checking} onRetry={() => retry.current()} />
  </dialog>;
}
