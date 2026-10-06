"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { RestoreButton } from "./RestoreButton";
import { saveTreatment, archiveTreatment } from "../actions";
import type { EditorState, TreatmentEditorData, TranslationEditorData } from "@/shared/model/treatment-editor";
import type { TreatmentTextPair } from "@/shared/model/types";

const languages = { ru: "Русский", he: "Иврит", en: "English" } as const;
type Locale = keyof typeof languages;

function PairEditor({ label, value, onChange }: { label: string; value: TreatmentTextPair[]; onChange: (value: TreatmentTextPair[]) => void }) {
  return <fieldset className="crm-pair-list"><legend>{label}</legend>{value.map(([title, description], index) => <div className="crm-pair" key={index}>
    <label>Заголовок пункта {index + 1}<input value={title} maxLength={10_000} onChange={e => onChange(value.map((pair, i) => i === index ? [e.target.value, pair[1]] : pair))} /></label>
    <label>Описание пункта {index + 1}<textarea rows={2} value={description} maxLength={10_000} onChange={e => onChange(value.map((pair, i) => i === index ? [pair[0], e.target.value] : pair))} /></label>
    <button type="button" className="crm-text-button" onClick={() => onChange(value.filter((_, i) => i !== index))}>Удалить пункт {index + 1}</button>
  </div>)}<button type="button" className="crm-secondary" disabled={value.length >= 40} onClick={() => onChange([...value, ["", ""]])}>+ Добавить пункт</button></fieldset>;
}

function LinesEditor({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return <fieldset className="crm-pair-list"><legend>{label}</legend>{value.map((line, index) => <div className="crm-line" key={index}><label><span className="crm-visually-hidden">{label}: пункт {index + 1}</span><textarea rows={2} value={line} maxLength={10_000} onChange={e => onChange(value.map((v, i) => i === index ? e.target.value : v))} /></label><button type="button" className="crm-text-button" aria-label={`Удалить пункт ${index + 1}`} onClick={() => onChange(value.filter((_, i) => i !== index))}>Удалить</button></div>)}<button type="button" className="crm-secondary" disabled={value.length >= 40} onClick={() => onChange([...value, ""])}>+ Добавить пункт</button></fieldset>;
}

export function TreatmentEditor({ initial }: { initial: TreatmentEditorData }) {
  const [data, setData] = useState(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [state, action, pending] = useActionState<EditorState, FormData>(saveTreatment, {});
  const [archiveState, archiveAction, archiving] = useActionState<EditorState, FormData>(archiveTreatment, {});
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [dirty, setDirty] = useState(false);
  const version = state.version ?? data.version;
  const published = state.isPublished ?? data.isPublished;
  const archived = initial.archived ?? false;
  const copy = data.translations[locale];
  const change = (values: Partial<TreatmentEditorData>) => { setDirty(true); setData(current => ({ ...current, ...values })); };
  const changeCopy = (values: Partial<TranslationEditorData>) => {
    setDirty(true); setData(current => ({ ...current, translations: { ...current.translations, [locale]: { ...current.translations[locale], ...values } } }));
  };
  const textField = (key: keyof Pick<TranslationEditorData, "description" | "concernsDescription" | "stepsDescription" | "skinDescription" | "contraindicationsNote">, label: string) => <label>{label}<textarea rows={key === "description" ? 4 : 2} value={copy[key]} maxLength={10_000} onChange={e => changeCopy({ [key]: e.target.value })} /></label>;
  return <>
    <Link className="crm-back" href={archived ? "/crm?archive=1" : published ? "/crm" : "/crm?draft=1"}>← К списку процедур</Link>
    <div className="crm-title-row"><div><p className="crm-eyebrow">Редактор процедуры</p><h1>{data.id === null ? "Новая процедура" : data.translations.ru.name || `Процедура №${data.id}`}</h1><p className="crm-muted">{archived ? "Процедура в архиве. Восстановите её, чтобы редактировать." : published ? "Процедура опубликована. Сохранение изменений обновляет сайт." : "Это черновик. Данные сохраняются в CRM и скрыты от посетителей сайта."}</p></div></div>
    {/* React resets native form controls after an action; remount them with saved controlled values. */}
    <form key={version ?? "new"} action={action} className="crm-editor" onSubmit={() => setDirty(false)}>
      <input type="hidden" name="data" value={JSON.stringify({ ...data, version, isPublished: published })} />
      <fieldset className="crm-panel" disabled={pending || archiving || archived}><legend>Общие параметры</legend>
        <div className="crm-grid"><label>Цена, ₪<input type="number" min="0" max="9999999" step="0.01" value={data.priceILS} onChange={e => change({ priceILS: e.target.value })} /></label><label>Длительность, минут<input type="number" min="1" max="1440" step="1" value={data.durationMinutes} onChange={e => change({ durationMinutes: e.target.value })} /></label></div>
        <div className="crm-grid"><label className="crm-check"><input type="checkbox" checked={data.priceFrom} onChange={e => change({ priceFrom: e.target.checked })} />Цена «от»</label><label className="crm-check"><input type="checkbox" checked={data.durationFrom} onChange={e => change({ durationFrom: e.target.checked })} />Длительность «от»</label></div>

        <label>Фотография<input value={data.photoUrl} maxLength={2000} placeholder="/treatmentsPhoto/example.jpg или https://…" onChange={e => change({ photoUrl: e.target.value })} /><small>Ссылка на готовое фото. Загрузку файлов добавим отдельным этапом.</small></label>
      </fieldset>
      <fieldset className="crm-panel" disabled={pending || archiving || archived}><legend>Тексты и переводы</legend>
        <div className="crm-language-tabs" aria-label="Язык перевода">{(Object.keys(languages) as Locale[]).map(language => <button type="button" key={language} aria-pressed={locale === language} onClick={() => setLocale(language)}>{languages[language]}</button>)}</div>
        <div className="crm-translation" dir={locale === "he" ? "rtl" : "ltr"} key={locale}>
          <label>Название<input value={copy.name} maxLength={200} onChange={e => changeCopy({ name: e.target.value })} /></label>
          {textField("description", "Описание процедуры")}
          {textField("concernsDescription", "Введение: какие задачи решает процедура")}
          <PairEditor label="Задачи процедуры" value={copy.concerns} onChange={concerns => changeCopy({ concerns })} />
          {textField("stepsDescription", "Введение: этапы процедуры")}
          <PairEditor label="Этапы процедуры" value={copy.steps} onChange={steps => changeCopy({ steps })} />
          <LinesEditor label="Типы кожи" value={copy.skinTypes} onChange={skinTypes => changeCopy({ skinTypes })} />
          {textField("skinDescription", "Пояснение о типах кожи")}
          <LinesEditor label="Противопоказания" value={copy.contraindications} onChange={contraindications => changeCopy({ contraindications })} />
          {textField("contraindicationsNote", "Примечание к противопоказаниям")}
        </div>
      </fieldset>
      <div className="crm-save-bar"><div aria-live="polite">{pending ? "Сохраняем…" : dirty ? "Есть несохранённые изменения" : state.saved ? "Изменения сохранены" : "Публикация требует названия и описания на всех трёх языках."}{state.error && <p className="crm-error" role="alert">{state.error}</p>}</div>{!archived && <div className="crm-save-actions"><button type="submit" className={published ? "crm-primary" : "crm-secondary"} disabled={pending || archiving || archived}>{pending ? "Сохраняем…" : published ? "Сохранить изменения" : "Сохранить черновик"}</button>{!published && <button type="submit" name="publication" value="publish" className="crm-primary" disabled={pending || archiving}>Опубликовать</button>}</div>}</div>
    </form>
    {archived && data.id !== null && <section className="crm-archive"><h2>Вернуть процедуру</h2><p className="crm-muted">После восстановления процедура появится в черновиках.</p><RestoreButton id={data.id} /></section>}
    {!archived && data.id !== null && <section className="crm-archive"><h2>Убрать процедуру с сайта</h2><p className="crm-muted">Архивирование сохраняет тексты и историю посещений. Процедуру можно восстановить.</p>{!confirmArchive && <button className="crm-secondary" onClick={() => setConfirmArchive(true)} disabled={pending}>Перенести в архив</button>}<form action={archiveAction} hidden={!confirmArchive}><input type="hidden" name="id" value={data.id} /><input type="hidden" name="version" value={version ?? ""} /><p>Перенести эту процедуру в архив?</p><button className="crm-danger" disabled={archiving || pending}>{archiving ? "Архивируем…" : "Да, архивировать"}</button> <button className="crm-secondary" type="button" onClick={() => setConfirmArchive(false)} disabled={archiving}>Отмена</button></form>{archiveState.error && <p role="alert" className="crm-error">{archiveState.error}</p>}</section>}
  </>;
}
