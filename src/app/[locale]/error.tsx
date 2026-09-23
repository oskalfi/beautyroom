"use client";
import { ServerErrorPage } from "@/components/ServerErrorPage";
import { useErrorLocale } from "@/components/ServerErrorPage/useErrorLocale";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = useErrorLocale();
  return <ServerErrorPage locale={locale} reset={reset} />;
}
