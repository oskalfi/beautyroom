"use client";
import { Carousel } from "@/shared/components/Carousel";
import styles from "./InstagramSection.module.css";
import Image from "next/image";
import Link from "next/link";

export const InstagramSection = () => {
  return (
    <section className={styles.sectionContainer}>
      <div className={styles.wrapper}>
        <h2 className={styles.heading}>Следите за нами в Instagram</h2>
        <Image
          src="/instagram.png"
          width={36}
          height={36}
          alt="Instagram"
          className={styles.instIcon}
        />
      </div>

      <Carousel />
      <Link
        href="https://www.instagram.com/kristina_beautician/"
        className={styles.buttonWrapper}
      >
        <div className={styles.toInstButton}>
          <img src="arrowInst.svg" alt="arrow" className={styles.arrow} />
          <div className={styles.buttonTextWrapper}>
            <span className={styles.buttonTextWhite}>Перейти в instagram</span>
          </div>
        </div>
        <span className={styles.buttonTextBlack}>Перейти в instagram</span>
      </Link>
    </section>
  );
};
