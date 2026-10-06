"use client";
import { useState } from "react";
import { authClient } from "@/shared/auth/client";

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return <div><button className="crm-secondary" disabled={pending} onClick={async () => {
    setPending(true); setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) { setError("Не удалось выйти."); return; }
      // Clear all cached authenticated page payloads with a full document navigation.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/crm/login");
    } catch { setError("Не удалось выйти."); }
    finally { setPending(false); }
  }}>{pending ? "Выходим…" : "Выйти"}</button>{error && <span role="alert">{error}</span>}</div>;
}
