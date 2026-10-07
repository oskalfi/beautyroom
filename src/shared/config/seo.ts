import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL = "https://beautyroomky.com";

export function treatmentMetadataDescription(locale: Locale, name: string) {
  const booking = { ru: "Запись", en: "Booking", he: "קביעת תור" }[locale];
  return `Beauty Room by Yael Kanter | Tel Aviv-Yafo | ${booking} | ${name}`;
}

export function localizedUrl(locale: string, path = "/") {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path === "/" ? "" : path}`;
}

export function languageAlternates(path = "/") {
  return Object.fromEntries([
    ...routing.locales.map((locale) => [locale, localizedUrl(locale, path)]),
    ["x-default", localizedUrl(routing.defaultLocale, path)],
  ]);
}

/** Each page defines its own canonical and sharing preview, rather than inheriting the homepage. */
export function pageMetadata({
  locale,
  path = "/",
  title,
  description,
  image,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const imageUrl = new URL(image || "/og-image.jpg", SITE_URL).href;
  return {
    title,
    description,
    alternates: {
      canonical: localizedUrl(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: localizedUrl(locale, path),
      siteName: "Beauty Room",
      locale: { he: "he_IL", en: "en_US", ru: "ru_RU" }[locale],
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: title,
          ...(!image ? { width: 1200, height: 630 } : {}),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// These are the contact details displayed on the public site. Opening hours are not yet supplied.
export const businessStructuredData = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${SITE_URL}/#business`,
  name: "Beauty Room by Yael Kanter",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: "+972532258055",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jerusalem Blvd 33",
    addressLocality: "Tel Aviv-Yafo",
    addressCountry: "IL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 32.052698,
    longitude: 34.7595119,
  },
  hasMap: "https://maps.app.goo.gl/WLxLtpTQESe6Jx4C7",
  sameAs: ["https://www.instagram.com/kristina_beautician/"],
};
