import type { Metadata } from "next";
import "@/app/styles/globals.css";
import { NotFoundPage } from "@/components/NotFoundPage";
import { PressFeedback } from "@/shared/components/PressFeedback";

export const metadata: Metadata = { title: "Page not found | Beauty Room", robots: { index: false, follow: false } };

export default function GlobalNotFound() {
  return <html lang="en"><body><PressFeedback /><NotFoundPage /></body></html>;
}
