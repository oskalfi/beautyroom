"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/shared/auth/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return <form className="crm-form" onSubmit={async (event) => {
    event.preventDefault();
    setError(""); setPending(true);
    const data = new FormData(event.currentTarget);
    try {
      const result = await authClient.signIn.email({
        email: String(data.get("email")).trim(), password: String(data.get("password")), rememberMe: false,
      });
      if (result.error) {
        const status = result.error.status;
        setError(status === 429
          ? "Слишком много попыток. Подождите минуту и попробуйте снова."
          : status === 403
            ? "Вход с этого адреса запрещён. Проверьте адрес сайта в настройках входа."
            : status >= 500
              ? "Ошибка сервера входа. Проверьте настройки сервера и подключение к базе."
              : status === 401
                ? "Не удалось войти. Проверьте email и пароль."
                : "Не удалось выполнить вход. Попробуйте ещё раз или обратитесь к разработчику.");
        return;
      }
      router.replace("/crm"); router.refresh();
    } catch { setError("Сервер недоступен. Попробуйте ещё раз."); }
    finally { setPending(false); }
  }}>
    <label>Email<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
    <label>Пароль<input name="password" type="password" autoComplete="current-password" required maxLength={128} /></label>
    {error && <p className="crm-error" role="alert">{error}</p>}
    <button disabled={pending} className="crm-primary" type="submit">{pending ? "Входим…" : "Войти"}</button>
  </form>;
}
