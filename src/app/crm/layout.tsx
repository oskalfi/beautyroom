import type { Metadata } from "next";
import "./crm.css";

export const metadata: Metadata = {
  title: "CRM | Beauty Room",
  robots: { index: false, follow: false },
};

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ru" dir="ltr"><body className="crm-body">{children}</body></html>;
}
