import type { Metadata } from "next";
import "@/app/styles/globals.css";
import { NotFoundPage } from "@/shared/components/NotFoundPage";
import { PressFeedback } from "@/shared/components/PressFeedback";

export const metadata: Metadata = { title: "העמוד לא נמצא | Beauty Room", robots: { index: false, follow: false } };

export default function GlobalNotFound() {
  return <html lang="he" dir="rtl"><body><PressFeedback /><NotFoundPage /></body></html>;
}
