"use client";
import { Carousel } from "@/shared/components/Carousel";
import styles from "./InstagramSection.module.css";

export const InstagramSection = () => {
  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.heading}>Остаёмся на связи</h2>
      <Carousel />
    </section>
  );
};
