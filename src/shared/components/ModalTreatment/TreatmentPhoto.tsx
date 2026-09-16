"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaLoader } from "../MediaLoader";
import styles from "./ModalTreatment.module.css";

export function TreatmentPhoto({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  return (
    <div className={styles.imageWrapper} aria-busy={status === "loading"}>
      <Image
        width={1575}
        height={2100}
        className={styles.image}
        src={src}
        alt={alt}
        style={{ opacity: status === "ready" ? 1 : 0 }}
        onLoad={() => setStatus("ready")}
        onError={() => setStatus("error")}
      />
      {status === "loading" && <MediaLoader label="Загрузка фотографии" />}
      {status === "error" && (
        <p className={styles.imageError} role="status">Не удалось загрузить фотографию</p>
      )}
    </div>
  );
}
