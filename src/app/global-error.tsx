"use client";
import "@/app/styles/globals.css";
import { ServerErrorPage } from "@/components/ServerErrorPage";
import { useErrorLocale } from "@/components/ServerErrorPage/useErrorLocale";
import { PressFeedback } from "@/shared/components/PressFeedback";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = useErrorLocale();
  return <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"}>
    <head><title>500 | Beauty Room</title><meta name="robots" content="noindex" /></head>
    <body><PressFeedback /><ServerErrorPage locale={locale} reset={reset} /></body>
  </html>;
}
