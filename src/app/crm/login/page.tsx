import { redirect } from "next/navigation";
import Link from "next/link";
import { getOwner } from "@/server/auth/owner";
import { LoginForm } from "../components/LoginForm";

export default async function LoginPage() {
  if (await getOwner()) redirect("/crm");
  return <main className="crm-login">
    <div className="crm-login-card">
      <p className="crm-brand">BEAUTY ROOM</p>
      <h1>Кабинет владельца</h1>
      <p className="crm-muted">Войдите, чтобы управлять процедурами и переводами сайта.</p>
      <LoginForm />
      <Link className="crm-back" href="/">← Вернуться на сайт</Link>
    </div>
  </main>;
}
