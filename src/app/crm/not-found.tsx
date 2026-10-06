import Link from "next/link";
export default function CrmNotFound() {
  return <main className="crm-main"><h1>Процедура не найдена</h1><p>Возможно, она перенесена в архив.</p><Link href="/crm">К списку процедур</Link></main>;
}
