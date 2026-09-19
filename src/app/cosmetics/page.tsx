import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Косметика для лица | Beauty Room",
  description:
    "Подбор косметики и домашнего ухода в Beauty Room после консультации или процедуры. Рекомендации с учётом типа и состояния вашей кожи. Тель-Авив — Яффо.",
};

export default function CosmeticsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero} aria-labelledby="cosmetics-title">
          <p className={styles.eyebrow}>Beauty Room · Домашний уход</p>
          <h1 id="cosmetics-title" className={styles.title}>
            Косметика, подобранная для вашей кожи
          </h1>
          <p className={styles.lead}>
            Найти подходящий уход проще, когда вы понимаете, что нужно именно
            вашей коже. В Beauty Room специалист поможет подобрать косметические
            средства после консультации или процедуры — с учётом типа кожи, её
            текущего состояния и ваших пожеланий.
          </p>
          <Link href="/contacts" className={styles.button}>
            Обсудить подбор ухода <span aria-hidden="true">↗</span>
          </Link>
        </section>

        <div className={styles.sections}>
          <section
            className={styles.panel}
            aria-labelledby="personal-care-title"
          >
            <h2 id="personal-care-title">Уход, в котором есть смысл</h2>
            <p>
              Сухость, жирный блеск, чувствительность и ощущение стянутости —
              поводы пересмотреть привычный уход. Выбор средств зависит не
              только от типа кожи, но и от того, в каком она сейчас состоянии.
            </p>
            <p>
              На консультации расскажите, какой косметикой вы уже пользуетесь,
              что вам нравится и какие средства вызывают дискомфорт. Это поможет
              специалисту предложить понятную схему домашнего ухода.
            </p>
          </section>
          <section
            className={styles.panel}
            aria-labelledby="after-treatment-title"
          >
            <h2 id="after-treatment-title">
              Что использовать после процедуры?
            </h2>
            <p>
              После{" "}
              <Link href="/procedures" className={styles.link}>
                косметологических процедур
              </Link>{" "}
              потребности кожи могут отличаться от привычных. Специалист
              подскажет, какие средства подходят в этот период, как их применять
              и когда можно возвращаться к привычному уходу.
            </p>
            <p>
              Обсудите очищение, увлажнение, защиту от солнца и дополнительные
              средства, если они потребуются. Рекомендации подбираются
              индивидуально, с учётом проведённой процедуры и реакции кожи.
            </p>
          </section>
        </div>

        <section
          className={styles.booking}
          aria-labelledby="consultation-title"
        >
          <h2 id="consultation-title">Начните с консультацию</h2>
          <p>
            Не знаете, с чего начать или что добавть в свою косметичку?
            Свяжитесь с Beauty Room, чтобы проконсультироваться или записаться
            процедуру.
          </p>
          <p>
            Принимаем в Тель-Авиве — Яффо:{" "}
            <Link href="/address">Jerusalem Blvd 33</Link>.
          </p>
          <Link href="/contacts" className={styles.button}>
            Связаться со специалистом <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
