import type { Language } from "@/lib/i18n";

// Number and date formatting for the /fund page, per site language.

const locales: Record<Language, string> = { en: "en-GB", pt: "pt-PT" };

export function formatPercent(
  value: number | null | undefined,
  language: Language,
  { signed = true, digits = 2 }: { signed?: boolean; digits?: number } = {}
) {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locales[language], {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(value);
}

/** A difference of two returns, in percentage points: "+0.61 pp". */
export function formatPoints(value: number | null | undefined, language: Language) {
  if (value == null || !Number.isFinite(value)) return "—";
  const number = new Intl.NumberFormat(locales[language], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(value * 100);
  return `${number} pp`;
}

export function formatMoney(value: number | null | undefined, language: Language, currency = "EUR") {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locales[language], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string, language: Language, { short = false }: { short?: boolean } = {}) {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat(locales[language], {
    day: "numeric",
    // pt-PT renders a "short" month as a number ("6/11/2026"); spell it out
    // in full dates there ("6 de novembro de 2026").
    month: language === "pt" && !short ? "long" : "short",
    year: short ? undefined : "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
