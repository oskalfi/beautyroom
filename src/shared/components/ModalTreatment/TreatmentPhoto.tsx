"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { MediaLoader } from "../MediaLoader";
import styles from "./ModalTreatment.module.css";

export function TreatmentPhoto({ src, alt }: { src: string; alt: string }) {
  const t = useTranslations("Media");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  return (
    <div className={styles.imageWrapper} aria-busy={status === "loading"}>
      <Image
        sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 932px) calc((100vw - 32px) / 2), 450px"
        quality={85}
        width={1575}
        height={2100}
        className={styles.image}
        src={src}
        alt={alt}
        style={{ opacity: status === "ready" ? 1 : 0 }}
        onLoad={() => setStatus("ready")}
        onError={() => setStatus("error")}
      />
      {status === "loading" && <MediaLoader label={t("imageLoading")} />}
      {status === "error" && (
        <p className={styles.imageError} role="status">{t("imageError")}</p>
      )}
    </div>
  );
}
