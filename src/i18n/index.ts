import en from "./en";
import hu from "./hu";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/taxonomy";

const dictionaries = { hu, en } as const;

export type Dictionary = typeof hu;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: string): Dictionary {
  return isLocale(locale) ? dictionaries[locale] : dictionaries[DEFAULT_LOCALE];
}

export function normalizeLocale(locale: string): Locale {
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export function vacancyLabel(t: Dictionary, days: number) {
  return days <= 0 ? t.listing.vacantNow : format(t.listing.vacantIn, { days });
}
