"use client";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useAccessibility, useMotionStopped, type Settings } from "./store";
import { useAccessibilityEffects } from "./effects";
import styles from "./Accessibility.module.css";

export function Accessibility() {
  const settings = useAccessibility();
  const stopped = useMotionStopped();
  const dialog = useRef<HTMLDialogElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useAccessibilityEffects();
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);
  useEffect(() => {
    if (!settings.ruler) return;
    const move = (event: PointerEvent) =>
      ruler.current?.style.setProperty("--reading-y", `${event.clientY}px`);
    const focus = (event: FocusEvent) => {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      ruler.current?.style.setProperty(
        "--reading-y",
        `${rect.top + rect.height / 2}px`,
      );
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("focusin", focus);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("focusin", focus);
    };
  }, [settings.ruler]);
  const toggle = (
    key:
      | "lineSpacing"
      | "letterSpacing"
      | "readableFont"
      | "underline"
      | "headings"
      | "ruler"
      | "keyboard",
    label: string,
  ) => (
    <button
      type="button"
      aria-pressed={settings[key]}
      onClick={() => settings.update({ [key]: !settings[key] })}
    >
      {label}
    </button>
  );
  return (
    <>
      <a
        className={styles.skip}
        href="#main-content"
        onClick={(event) => {
          const main = document.querySelector("main");
          if (main) {
            event.preventDefault();
            main.tabIndex = -1;
            main.focus();
            main.scrollIntoView({ behavior: "instant" });
          }
        }}
      >
        Перейти к основному содержимому
      </a>
      {settings.ruler && !open && (
        <div ref={ruler} className={styles.ruler} aria-hidden="true" />
      )}
      <button
        data-press-feedback
        className={styles.trigger}
        type="button"
        aria-label="Настройки доступности"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="accessibility-menu"
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
      >
        {/* User-supplied vector, served unchanged. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/accessibility.svg" width="56" height="56" alt="" />
      </button>
      <dialog
        ref={dialog}
        id="accessibility-menu"
        className={styles.panel}
        aria-labelledby="accessibility-title"
        onClose={() => setOpen(false)}
        onKeyDown={(event) => {
          if (
            !["ArrowDown", "ArrowUp"].includes(event.key) ||
            !(event.target instanceof HTMLButtonElement)
          )
            return;
          const items = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button:not([disabled]), select, a[href]",
            ),
          );
          const index = items.indexOf(event.target);
          const next =
            items[
              (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
                items.length
            ];
          event.preventDefault();
          next?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const r = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < r.left ||
              event.clientX > r.right ||
              event.clientY < r.top ||
              event.clientY > r.bottom
            )
              dialog.current?.close();
          }
        }}
      >
        <div className={styles.titleRow}>
          <h2 id="accessibility-title">Доступность</h2>
          <button
            type="button"
            aria-label="Закрыть настройки доступности"
            onClick={() => dialog.current?.close()}
          >
            ✕
          </button>
        </div>
        <button type="button" onClick={settings.reset}>
          Сбросить настройки
        </button>

        <fieldset>
          <legend>Текст</legend>
          <div className={styles.fontSize}>
            <button
              type="button"
              aria-label="Уменьшить текст"
              disabled={settings.textScale <= 100}
              onClick={() =>
                settings.update({
                  textScale: Math.max(100, settings.textScale - 25),
                })
              }
            >
              A−
            </button>
            <output aria-live="polite">{settings.textScale}%</output>
            <button
              type="button"
              aria-label="Увеличить текст"
              disabled={settings.textScale >= 200}
              onClick={() =>
                settings.update({
                  textScale: Math.min(200, settings.textScale + 25),
                })
              }
            >
              A+
            </button>
          </div>
          {toggle("lineSpacing", "Увеличить межстрочный интервал")}
          {toggle("letterSpacing", "Увеличить межбуквенный интервал")}
          {toggle("readableFont", "Читабельный шрифт Arial")}
        </fieldset>
        <fieldset>
          <legend>Цвет и контраст</legend>
          <label htmlFor="a11y-contrast">Цветовой режим</label>
          <select
            id="a11y-contrast"
            value={settings.contrast}
            onChange={(event) =>
              settings.update({
                contrast: event.target.value as Settings["contrast"],
              })
            }
          >
            <option value="normal">Обычные цвета</option>
            <option value="dark">Светлый текст на тёмном</option>
            <option value="light">Тёмный текст на светлом</option>
            <option value="invert">Инверсия цветов</option>
            <option value="mono">Оттенки серого</option>
          </select>
        </fieldset>
        <fieldset>
          <legend>Ориентирование</legend>
          {toggle("underline", "Подчеркнуть все ссылки")}
          {toggle("headings", "Выделить заголовки")}
          {toggle("keyboard", "Усиленная клавиатурная навигация")}
          <p>
            Tab / Shift + Tab — переход; Enter — открыть ссылку; пробел — нажать
            кнопку; Esc — закрыть меню. В усиленном режиме ↑ / ↓ переходят между
            элементами вне полей ввода.
          </p>
        </fieldset>
        <fieldset>
          <legend>Движение и чтение</legend>
          <button
            type="button"
            aria-pressed={stopped}
            onClick={() => settings.update({ motion: !stopped })}
          >
            Остановить анимации и видео
          </button>
          {toggle("ruler", "Линейка для чтения")}
          <label htmlFor="a11y-cursor">Курсор</label>
          <select
            id="a11y-cursor"
            value={settings.cursor}
            onChange={(event) =>
              settings.update({
                cursor: event.target.value as Settings["cursor"],
              })
            }
          >
            <option value="normal">Обычный</option>
            <option value="black">Увеличенный чёрный</option>
            <option value="white">Увеличенный белый</option>
          </select>
        </fieldset>
        <Link className={styles.statement} href="/accessibility">
          Заявление о доступности /{" "}
          <span lang="he" dir="rtl">
            הצהרת נגישות
          </span>
        </Link>
      </dialog>
    </>
  );
}
