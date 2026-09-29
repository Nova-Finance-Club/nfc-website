"use client";

import { usePathname } from "next/navigation";

import { LANGUAGE_COOKIE, localizePath, stripLanguage, type Language } from "@/lib/i18n";
import { useLanguage, useT } from "@/lib/language";
import { cn } from "@/lib/utils";

// Switches between "/about" and "/pt/about". A plain <a> (full page load),
// because the two languages are separate prerendered trees with their own
// <html lang>. The choice is remembered in a cookie so src/proxy.ts can send
// a returning reader to the same language.
function rememberLanguage(next: Language) {
  document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageToggle({ className }: { className?: string }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const t = useT();
  const base = stripLanguage(pathname || "/");

  const option = (lang: Language, label: string) => {
    const active = language === lang;
    return (
      <a
        href={localizePath(lang, base)}
        hrefLang={lang === "pt" ? "pt-PT" : "en"}
        lang={lang === "pt" ? "pt-PT" : "en"}
        aria-current={active ? "true" : undefined}
        onClick={() => rememberLanguage(lang)}
        className={cn(
          "rounded-md px-1.5 py-1 transition-colors",
          active ? "bg-primary text-primary-foreground" : "hover:text-foreground"
        )}
      >
        {label}
      </a>
    );
  };

  return (
    <div
      role="group"
      aria-label={t("language.toggleLabel", "Switch language")}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-lg border px-1 text-xs font-medium tracking-wide text-muted-foreground",
        className
      )}
    >
      {option("en", "EN")}
      {option("pt", "PT")}
    </div>
  );
}
