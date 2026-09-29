"use client";

import { usePathname } from "next/navigation";

import { LANGUAGE_COOKIE, localizePath, stripLanguage, type Language } from "@/lib/i18n";
import { useLanguage, useT } from "@/lib/language";
import { cn } from "@/lib/utils";

// Switches between "/about" and "/pt/about". The whole pill is one switch:
// a click anywhere on it — on "EN", on "PT" or between them — goes to the
// other language; the two labels only show which one is active. A plain
// <a> (full page load), because the two languages are separate prerendered
// trees with their own <html lang>. The choice is remembered in a cookie so
// src/proxy.ts can send a returning reader to the same language.
function rememberLanguage(next: Language) {
  document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageToggle({ className }: { className?: string }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const t = useT();
  const base = stripLanguage(pathname || "/");
  const next: Language = language === "pt" ? "en" : "pt";

  const label = (lang: Language, text: string) => (
    <span
      className={cn(
        "rounded-md px-1.5 py-1 transition-colors",
        language === lang ? "bg-primary text-primary-foreground" : "group-hover:text-foreground"
      )}
    >
      {text}
    </span>
  );

  return (
    <a
      href={localizePath(next, base)}
      hrefLang={next === "pt" ? "pt-PT" : "en"}
      onClick={() => rememberLanguage(next)}
      aria-label={
        next === "pt"
          ? t("language.switchToPt", "Mudar para português")
          : t("language.switchToEn", "Switch to English")
      }
      className={cn(
        "group inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border px-1 text-xs font-medium tracking-wide text-muted-foreground transition-colors hover:border-brand-navy/40",
        className
      )}
    >
      <span aria-hidden="true" className="contents">
        {label("en", "EN")}
        {label("pt", "PT")}
      </span>
    </a>
  );
}
