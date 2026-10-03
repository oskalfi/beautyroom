import type { Locale } from "@/i18n/routing";

const bookingMessages: Record<Locale, string> = {
  ru: "Здравствуйте! Хочу записаться на процедуру.",
  en: "Hello! I would like to book a treatment.",
  he: "שלום! אשמח לקבוע תור לטיפול.",
};

export function getBookingUrl(locale: Locale) {
  return "https://wa.me/972532258055?text=" + encodeURIComponent(bookingMessages[locale]);
}

export const BOOKING_URL = getBookingUrl("ru");
