// Language plumbing shared by server and client code (no "use client" here,
// so page.tsx files can translate their own metadata on the server).
//
// Routing: English lives at the root ("/about"), Portuguese under "/pt"
// ("/pt/about"). Internally every page sits under app/[lang]/, and
// src/proxy.ts rewrites unprefixed URLs to "/en/..." — so "/en" never shows
// up in a visible URL (proxy.ts redirects it away if someone types it).

import { pt } from "@/lib/translations-pt";

export const languages = ["en", "pt"] as const;
export type Language = (typeof languages)[number];
export const defaultLanguage: Language = "en";

// Remembers an explicit choice made with the language toggle, so proxy.ts
// can send a returning Portuguese reader straight to /pt.
export const LANGUAGE_COOKIE = "nfc-lang";

export function isLanguage(value: string): value is Language {
  return (languages as readonly string[]).includes(value);
}

export type Vars = Record<string, string | number>;

function interpolate(text: string, vars?: Vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, token) =>
    token in vars ? String(vars[token]) : match
  );
}

/**
 * translate(lang, key, english, vars?) — the Portuguese dictionary entry for
 * `key` when `lang` is "pt" (falling back to `english` if the key is
 * missing), otherwise `english`. English stays the single source of truth
 * at the call site; only Portuguese lives in translations-pt.ts.
 */
export function translate(lang: Language, key: string, english: string, vars?: Vars) {
  return interpolate(lang === "pt" ? (pt[key] ?? english) : english, vars);
}

/** "/about" -> "/pt/about" in Portuguese; "/" -> "/pt"; "/#contact" -> "/pt#contact". */
export function localizePath(lang: Language, href: string) {
  if (lang === defaultLanguage || !href.startsWith("/")) return href;
  if (href === "/") return "/pt";
  if (href.startsWith("/#") || href.startsWith("/?")) return `/pt${href.slice(1)}`;
  return `/pt${href}`;
}

/** Visible pathname without its language prefix: "/pt/about" -> "/about". */
export function stripLanguage(pathname: string) {
  if (pathname === "/pt" || pathname === "/en") return "/";
  if (pathname.startsWith("/pt/") || pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

export function htmlLang(lang: Language) {
  return lang === "pt" ? "pt-PT" : "en";
}
