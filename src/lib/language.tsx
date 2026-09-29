"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";

import { localizePath, translate, type Language, type Vars } from "@/lib/i18n";

export type { Language } from "@/lib/i18n";

// The language comes from the URL (the [lang] route segment), handed down
// by app/[lang]/layout.tsx — so the server renders Portuguese pages in
// Portuguese and search engines index both versions. No localStorage.
const LanguageContext = createContext<Language | null>(null);

export function LanguageProvider({
  language,
  children,
}: {
  language: Language;
  children: ReactNode;
}) {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const language = useContext(LanguageContext);
  if (!language) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return { language };
}

/**
 * t(key, english, vars?) — Portuguese from translations-pt.ts on /pt pages,
 * the inline English everywhere else. See translate() in lib/i18n.ts.
 */
export function useT() {
  const { language } = useLanguage();
  return useCallback(
    (key: string, english: string, vars?: Vars) => translate(language, key, english, vars),
    [language]
  );
}

/** href("/about") -> "/pt/about" on Portuguese pages, unchanged in English. */
export function useLocalizedHref() {
  const { language } = useLanguage();
  return useCallback((href: string) => localizePath(language, href), [language]);
}
