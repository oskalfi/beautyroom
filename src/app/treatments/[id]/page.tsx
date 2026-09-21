import { BOOKING_URL } from "@/shared/config/booking";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTreatmentById } from "@/shared/api/treatments";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const treatment = await getTreatmentById(id);
  if (!treatment) notFound();

  return {
    title: `${treatment.name} | Beauty Room`,
    description: treatment.description,
  };
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const treatment = await getTreatmentById(id);
  if (!treatment) notFound();

  return (
    <main className={styles.page}>
      <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
        <Link href="/">Главная</Link><span aria-hidden="true">/</span>
        <Link href="/procedures">Процедуры</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{treatment.name}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="treatment-title">
        {treatment.imgPath ? <Image src={treatment.imgPath} alt={treatment.name} width={525} height={700}
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1180px) 45vw, 525px"
          quality={85} preload className={styles.photo} /> : <div className={`${styles.photo} ${styles.photoPlaceholder}`}>Фото процедуры</div>}
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Beauty Room / Уход за лицом</p>
          <h1 id="treatment-title" className={styles.title}>{treatment.name}</h1>
          <p className={styles.description}>{treatment.description}</p>
          <a href={BOOKING_URL} className={styles.primaryLink}>Записаться на процедуру <span aria-hidden="true">↗</span></a>
          <p className={styles.caption}>Начинаем с оценки состояния вашей кожи</p>
        </div>
      </section>

      <nav aria-label="О процедуре" className={styles.sectionNav}>
        <a href="#treatment-concerns">Какие задачи решает ↗</a>
        <a href="#treatment-steps">Как проходит ↗</a>
        <a href="#treatment-skin">Типы кожи ↗</a>
        <a href="#treatment-contraindications">Противопоказания ↗</a>
      </nav>

      <section id="treatment-concerns" className={styles.section} aria-labelledby="concerns-title">
        <div className={styles.sectionHeading}>
          <h2 id="concerns-title">Какие задачи<br />решает процедура</h2>
          <p>{treatment.concernsDescription}</p>
        </div>
        <ul className={styles.concerns}>
          {treatment.concerns.map(([title, description], index) => (
            <li key={title} className={styles.concern}>
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section id="treatment-steps" className={styles.section} aria-labelledby="steps-title">
        <div className={styles.sectionHeading}>
          <h2 id="steps-title">Как проходит<br />процедура</h2>
          <p>{treatment.stepsDescription}</p>
        </div>
        <ol className={styles.steps}>
          {treatment.steps.map(([title, description], index) => (
            <li key={title} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <div className={styles.suitability}>
        <section id="treatment-skin" aria-labelledby="skin-title">
          <p className={styles.eyebrow}>Индивидуальный подбор</p>
          <h2 id="skin-title">Для какой кожи</h2>
          <ul className={styles.skinTypes}>{treatment.skinTypes.map((type) => <li key={type}>{type}</li>)}</ul>
          <p className={styles.note}>{treatment.skinDescription}</p>
        </section>
        <section id="treatment-contraindications" className={styles.contraindications} aria-labelledby="contraindications-title">
          <p className={styles.eyebrow}>Перед процедурой</p>
          <h2 id="contraindications-title">Противопоказания</h2>
          <ul className={styles.limitations}>
            {treatment.contraindications.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className={styles.note}>{treatment.contraindicationsNote}</p>
        </section>
      </div>

      <section id="treatment-booking" className={styles.booking} aria-labelledby="booking-title">
        <div><p className={styles.eyebrow}>Ваш следующий шаг</p>
          <h2 id="booking-title">Начнём со знакомства</h2>
          <p>Обсудим вашу кожу и подберём подходящий уход.</p>
        </div>
        <a href={BOOKING_URL} className={styles.primaryLink}>Записаться в WhatsApp <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}
