import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionRoot } from "@/components/motion-primitives";
import { LanguageProvider } from "@/lib/language";
import { htmlLang, isLanguage, languages, translate } from "@/lib/i18n";
import { languageAlternates } from "@/lib/seo";
import { siteConfig } from "@/lib/site-data";
import { libreBaskerville } from "@/lib/fonts";

// Both languages are prerendered at build time; any other first segment
// (e.g. "/fr") is a 404 rather than a runtime render.
export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang = isLanguage(raw) ? raw : "en";
  const description = translate(
    lang,
    "meta.site.description",
    "Nova Finance Club (NFC) is the student-run finance club of NOVA School of Science and Technology (NOVA FCT): a virtual investment fund, quantitative finance projects, market analysis and events."
  );
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} (${siteConfig.shortName}) — ${siteConfig.institution}`,
      template: `%s — ${siteConfig.name}`,
    },
    description,
    alternates: { canonical: lang === "pt" ? "/pt" : "/", languages: languageAlternates("/") },
    openGraph: {
      siteName: siteConfig.name,
      locale: lang === "pt" ? "pt_PT" : "en_GB",
      type: "website",
      description,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return (
    <html
      lang={htmlLang(lang)}
      className={`${libreBaskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider language={lang}>
          <MotionRoot>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </MotionRoot>
        </LanguageProvider>
      </body>
    </html>
  );
}
