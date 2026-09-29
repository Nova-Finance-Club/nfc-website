import type { Metadata } from "next";

import { isLanguage, languages, localizePath, translate, type Language } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-data";

/** Narrows the [lang] route param; the layout's generateStaticParams only ever yields en/pt. */
export function langFrom(value: string): Language {
  return isLanguage(value) ? value : "en";
}

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

/** hreflang map for a path: { en: "/about", pt: "/pt/about", "x-default": "/about" }. */
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(languages.map((l) => [l === "pt" ? "pt-PT" : "en", localizePath(l, path)])),
    "x-default": path,
  };
}

/**
 * Per-page metadata in the page's own language, with canonical + hreflang
 * alternates and Open Graph fields. `path` is the English (unprefixed) path.
 * The share image comes from app/[lang]/opengraph-image.png automatically.
 */
export function pageMetadata(
  lang: Language,
  path: string,
  opts: { titleKey?: string; title?: string; descriptionKey: string; description: string; vars?: Record<string, string | number> }
): Metadata {
  const title = opts.title
    ? opts.titleKey
      ? translate(lang, opts.titleKey, opts.title, opts.vars)
      : opts.title
    : undefined;
  const description = translate(lang, opts.descriptionKey, opts.description, opts.vars);
  const url = localizePath(lang, path);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      ...(title ? { title: `${title} — ${siteConfig.name}` } : {}),
      description,
      url,
      siteName: siteConfig.name,
      locale: lang === "pt" ? "pt_PT" : "en_GB",
      type: "website",
    },
  };
}
