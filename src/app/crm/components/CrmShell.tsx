import Link from "next/link";
import { requireOwner } from "@/server/auth/owner";
import { LogoutButton } from "./LogoutButton";

export async function CrmShell({ children }: { children: React.ReactNode }) {
  const owner = await requireOwner();
  return <>
    <header className="crm-header">
      <Link className="crm-brand" href="/crm">BEAUTY ROOM <span> / CRM</span></Link>
      <nav aria-label="Навигация кабинета"><Link href="/crm">Процедуры</Link><a href="/" target="_blank" rel="noreferrer">Открыть сайт ↗</a></nav>
      <div className="crm-account"><span>{owner.email}</span><LogoutButton /></div>
    </header>
    <main className="crm-main">{children}</main>
  </>;
}
