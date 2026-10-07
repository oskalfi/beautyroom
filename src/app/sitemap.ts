import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { getDb } from "@/server/db/client";
import { routing } from "@/i18n/routing";
import { localizedUrl, languageAlternates } from "@/shared/config/seo";

// Generate from the current published data; CRM actions invalidate the shared treatments tag.
export const dynamic = "force-dynamic";

const sitemapTreatments = unstable_cache(async () => getDb().treatment.findMany({
  where: { isPublished: true, archivedAt: null },
  select: { id: true, updatedAt: true, translations: { select: { locale: true, name: true, description: true } } },
  orderBy: { id: "asc" },
}), ["sitemap-treatments-v1"], { tags: ["treatments"], revalidate: 60 });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["/", "/procedures", "/cosmetics", "/address", "/contacts", "/accessibility"];
  const entries: MetadataRoute.Sitemap = pages.flatMap(path => routing.locales.map(locale => ({
    url: localizedUrl(locale, path),
    alternates: { languages: languageAlternates(path) },
  })));
  for (const treatment of await sitemapTreatments()) {
    const path = `/treatments/${treatment.id}`;
    const copies = treatment.translations.filter(copy => copy.name && copy.description);
    const languages = Object.fromEntries(copies.map(copy => [copy.locale, localizedUrl(copy.locale, path)]));
    if (languages.he) languages["x-default"] = languages.he;
    for (const copy of copies) entries.push({
      url: localizedUrl(copy.locale, path),
      lastModified: treatment.updatedAt,
      alternates: { languages },
    });
  }
  return entries;
}
