"use client";
import Link from "next/link";
export default function CrmError({ reset }: { reset: () => void }) {
  return <main className="crm-main"><h1>Кабинет временно недоступен</h1><p>Не удалось загрузить данные. Проверьте подключение и повторите попытку.</p><button className="crm-primary" onClick={reset}>Попробовать снова</button> <Link href="/">На сайт</Link></main>;
}
