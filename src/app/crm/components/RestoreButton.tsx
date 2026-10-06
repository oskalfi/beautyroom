"use client";
import { useActionState } from "react";
import { restoreTreatment } from "../actions";
import type { EditorState } from "@/shared/model/treatment-editor";

export function RestoreButton({ id }: { id: number }) {
  const [state, action, pending] = useActionState<EditorState, FormData>(restoreTreatment, {});
  return <form action={action}><input type="hidden" name="id" value={id} /><button className="crm-secondary" disabled={pending}>{pending ? "Восстанавливаем…" : "Восстановить"}</button>{state.error && <p className="crm-error" role="alert">{state.error}</p>}</form>;
}
