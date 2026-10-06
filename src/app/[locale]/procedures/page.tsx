import { initPageLocale } from "@/i18n/pageLocale";
import type { Metadata } from "next";
import { getTreatments } from "@/shared/api/treatments";
import { getTranslations } from "next-intl/server";
import { TreatmentsCatalog } from "./TreatmentsCatalog";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await initPageLocale(params);
  const t = await getTranslations({ locale, namespace: "Treatment" });
  return { title: t("procedures") + " | Beauty Room", description: t("catalogDescription") };
}

export default async function ProceduresPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await initPageLocale(params);
  const publishedTreatments = await getTreatments(locale);
  const treatments = publishedTreatments.map(
    ({ id, name, imgPath, description, priceILS, priceFrom, durationMinutes, durationFrom }) => ({
      id,
      name,
      imgPath,
      description,
      priceILS,
      priceFrom,
      durationMinutes,
      durationFrom,
    }),
  );
  return <TreatmentsCatalog treatments={treatments} />;
}
