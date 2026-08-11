"use client";
import { Carousel } from "@/shared/components/Carousel";
import styles from "./InstagramSection.module.css";
import Image from "next/image";

export const InstagramSection = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.wrapper}>
        {" "}
        <h2 className={styles.heading}>Мы в Instagram</h2>
        <Image
          src="/instagram.png"
          width={42}
          height={42}
          alt="Instagram"
          className={styles.instIcon}
        />
      </div>

      <Carousel />
    </section>
  );
};
