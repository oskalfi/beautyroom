"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, useTransition, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { reorderTreatments } from "../actions";

export type TreatmentCardData = { id: number; version: string; editedAtLabel: string; editedByName: string; name: string; searchText?: string; price: string; duration: string };

export function TreatmentCards({ initial, view, query }: { initial: TreatmentCardData[]; view: "published" | "drafts" | "archive"; query: string }) {
  const [items, setItems] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [ghost, setGhost] = useState<{ left: number; top: number; width: number; height: number; item: TreatmentCardData } | null>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState<number | null>(null);
  const current = useRef(initial);
  const drag = useRef<{ id: number; before: TreatmentCardData[]; offsetX: number; offsetY: number } | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const ghostElement = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<number, DOMRect>());
  const animations = useRef(new Map<number, Animation>());
  const reorderable = view === "published" && editing && !query && !pending;
  const dirty = items.some((item, index) => item.id !== saved[index]?.id);
  const matches = (item: TreatmentCardData) => !query || (item.searchText ?? item.name).toLocaleLowerCase().includes(query.toLocaleLowerCase());

  useLayoutEffect(() => {
    const before = positions.current;
    positions.current = new Map();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (const element of list.current?.querySelectorAll<HTMLElement>("[data-treatment-id]") ?? []) {
      const id = Number(element.dataset.treatmentId);
      const previous = before.get(id);
      if (!previous) continue;
      const next = element.getBoundingClientRect();
      const x = previous.left - next.left;
      const y = previous.top - next.top;
      if (Math.abs(x) < 1 && Math.abs(y) < 1) continue;
      const animation = element.animate([{ transform: `translate(${x}px, ${y}px)` }, { transform: "translate(0, 0)" }], { duration: 320, easing: "cubic-bezier(.22, 1, .36, 1)" });
      animations.current.set(id, animation);
      void animation.finished.then(() => { if (animations.current.get(id) === animation) animations.current.delete(id); }).catch(() => {});
    }
  }, [items]);

  useEffect(() => {
    const active = animations.current;
    return () => { for (const animation of active.values()) animation.cancel(); };
  }, []);
  useEffect(() => {
    if (!editing || !dirty) return;
    function warn(event: BeforeUnloadEvent) { event.preventDefault(); }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [editing, dirty]);

  function preview(next: TreatmentCardData[]) {
    const before = new Map<number, DOMRect>();
    for (const element of list.current?.querySelectorAll<HTMLElement>("[data-treatment-id]") ?? []) before.set(Number(element.dataset.treatmentId), element.getBoundingClientRect());
    for (const animation of animations.current.values()) animation.cancel();
    animations.current.clear(); positions.current = before;
    current.current = next; setItems(next);
  }
  function save() {
    const next = current.current;
    if (saved.every((item, index) => item.id === next[index].id)) { setEditing(false); return; }
    setError(""); setMessage("Сохраняем порядок…");
    startTransition(async () => {
      try {
        const result = await reorderTreatments({ expected: saved.map(({ id, version }) => ({ id, version })), ids: next.map(item => item.id) });
        if (result.error) { setError(result.error); setMessage(""); }
        else { setSaved(next); setEditing(false); setMessage("Порядок сохранён на сайте."); }
      } catch { setMessage(""); setError("Не удалось подтвердить сохранение порядка. Проверьте соединение и попробуйте снова."); }
    });
  }
  function cancelEditing() { preview(saved); setEditing(false); setError(""); setMessage("Изменения порядка отменены."); }
  function move(id: number, offset: number) {
    if (!reorderable || drag.current) return;
    const before = current.current;
    const from = before.findIndex(item => item.id === id);
    const to = from + offset;
    if (to < 0 || to >= before.length) return;
    const next = [...before]; const [item] = next.splice(from, 1); next.splice(to, 0, item);
    preview(next); setMessage("Новый порядок пока не сохранён.");
  }
  function startDrag(event: PointerEvent<HTMLButtonElement>, id: number) {
    if (!reorderable || dragging !== null || event.button !== 0) return;
    event.preventDefault(); event.currentTarget.closest("ol")?.setPointerCapture(event.pointerId);
    const card = event.currentTarget.closest<HTMLElement>("[data-treatment-id]");
    const item = current.current.find(item => item.id === id);
    if (!card || !item) return;
    const bounds = card.getBoundingClientRect();
    drag.current = { id, before: current.current, offsetX: event.clientX - bounds.left, offsetY: event.clientY - bounds.top };
    setGhost({ left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height, item });
    setDragging(id); setError(""); setMessage("");
  }
  function dragMove(event: PointerEvent<HTMLOListElement>) {
    if (!drag.current) return;
    const gesture = drag.current;
    setGhost(current => current && ({ ...current, left: event.clientX - gesture.offsetX, top: event.clientY - gesture.offsetY }));
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-treatment-id]");
    const targetId = Number(target?.dataset.treatmentId);
    const from = current.current.findIndex(item => item.id === drag.current?.id);
    const to = current.current.findIndex(item => item.id === targetId);
    if (event.clientY < 80) window.scrollBy(0, -20);
    else if (event.clientY > window.innerHeight - 80) window.scrollBy(0, 20);
    if (from < 0 || to < 0 || from === to || !target || !list.current) return;
    const middle = list.current.getBoundingClientRect().top + target.offsetTop + target.offsetHeight / 2;
    if ((from < to && event.clientY < middle) || (from > to && event.clientY > middle)) return;
    const next = [...current.current]; const [item] = next.splice(from, 1); next.splice(to, 0, item); preview(next);
  }
  async function finishDrag(cancel = false) {
    const gesture = drag.current; drag.current = null;
    if (!gesture) return;
    if (cancel) preview(gesture.before);
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    const element = list.current?.querySelector<HTMLElement>(`[data-treatment-id="${gesture.id}"]`);
    const floating = ghostElement.current;
    if (element && floating && list.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const bounds = floating.getBoundingClientRect();
      const top = list.current.getBoundingClientRect().top + element.offsetTop;
      const left = list.current.getBoundingClientRect().left + element.offsetLeft;
      const animation = floating.animate([{ transform: "translate(0, 0)" }, { transform: `translate(${left - bounds.left}px, ${top - bounds.top}px)` }], { duration: 220, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "forwards" });
      await animation.finished.catch(() => {});
    }
    setDragging(null); setGhost(null);
    setMessage(cancel ? "Перетаскивание отменено." : "Новый порядок пока не сохранён.");
  }
  const visible = items.filter(matches);
  return <>
    {view === "published" && <div className="crm-order-toolbar">
      {editing ? <><p className="crm-muted crm-order-help">Меняйте порядок стрелками или перетаскивайте карточки за значок ⋮⋮. Сайт обновится только после сохранения.</p><div className="crm-order-actions"><button type="button" className="crm-primary" disabled={pending || dragging !== null} onClick={save}>{pending ? "Сохраняем…" : "Сохранить порядок"}</button><button type="button" className="crm-secondary" disabled={pending || dragging !== null} onClick={cancelEditing}>Отмена</button></div></> : <><p className="crm-muted crm-order-help">Цифры слева показывают положение процедуры в меню сайта.{query && " Для изменения порядка очистите поиск."}</p><button type="button" className="crm-secondary" disabled={!!query || items.length < 2} onClick={() => { setEditing(true); setMessage(""); setError(""); }}>Редактировать порядок процедур в списке</button></>}
    </div>}
    <div role="status" aria-live="polite" className="crm-order-message">{message}</div>
    {error && <p className="crm-error" role="alert">{error}</p>}
    <ol ref={list} className="crm-cards" aria-label="Процедуры" aria-busy={pending} onPointerMove={dragMove} onPointerUp={() => finishDrag()} onPointerCancel={() => finishDrag(true)} onLostPointerCapture={() => finishDrag(true)}>
      {items.map((item, index) => matches(item) && <li key={item.id} data-treatment-id={item.id} className={`crm-procedure-card${dragging === item.id ? " crm-card-dragging" : ""}`}>
        <div className="crm-card-controls">
          {view === "published" && <span className="crm-card-number" aria-label={`Позиция на сайте: ${index + 1}`}>{index + 1}</span>}
          {view === "published" && editing && <>
            <button type="button" className="crm-order-button" aria-label={`Поднять «${item.name}»`} disabled={!reorderable || index === 0 || dragging !== null} onClick={() => move(item.id, -1)}>↑</button>
            <button type="button" className="crm-drag-handle" aria-label={`Перетащить «${item.name}». Стрелки вверх и вниз также меняют порядок.`} disabled={!reorderable} onPointerDown={e => startDrag(e, item.id)} onKeyDown={e => { if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); move(item.id, e.key === "ArrowUp" ? -1 : 1); } }}>⋮⋮</button>
            <button type="button" className="crm-order-button" aria-label={`Опустить «${item.name}»`} disabled={!reorderable || index === items.length - 1 || dragging !== null} onClick={() => move(item.id, 1)}>↓</button>
          </>}
        </div>
        <Link className="crm-card-link" href={`/crm/treatments/${item.id}`} aria-label={`${view === "archive" ? "Открыть" : "Редактировать"}: ${item.name}`} aria-disabled={editing || pending || dragging !== null} onClick={e => { if (editing || pending || dragging !== null) e.preventDefault(); }}>
          <strong className="crm-card-name">{item.name}</strong>
          <dl className="crm-card-meta"><div><dt>Цена</dt><dd>{item.price}</dd></div><div><dt>Длительность</dt><dd>{item.duration}</dd></div></dl>
          <div className="crm-card-edited"><p>Последнее редактирование: <time dateTime={item.version} title="Время Израиля">{item.editedAtLabel}</time></p><p>Администратор: {item.editedByName}</p></div>
        </Link>
      </li>)}
    </ol>
    {ghost && createPortal(<div ref={ghostElement} className="crm-drag-preview" style={{ left: ghost.left, top: ghost.top, width: ghost.width, height: ghost.height }} aria-hidden="true"><strong className="crm-card-name">{ghost.item.name}</strong><dl className="crm-card-meta"><div><dt>Цена</dt><dd>{ghost.item.price}</dd></div><div><dt>Длительность</dt><dd>{ghost.item.duration}</dd></div></dl></div>, document.body)}
    {visible.length === 0 && <div className="crm-empty">{query ? "По этому запросу ничего не найдено." : view === "archive" ? "Архив пока пуст." : view === "drafts" ? "Черновиков пока нет. Добавьте процедуру, чтобы начать подготовку." : "Опубликованных процедур пока нет. Подготовьте процедуру в черновиках и опубликуйте её."}</div>}
  </>;
}
