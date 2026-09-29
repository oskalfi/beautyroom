"use client";
import { ServerErrorPage } from "@/shared/components/ServerErrorPage";
import { useErrorLocale } from "@/shared/components/ServerErrorPage/useErrorLocale";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = useErrorLocale();
  return <ServerErrorPage locale={locale} reset={reset} />;
}
