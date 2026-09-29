import type { MetadataRoute } from "next";

import { localizePath } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";
import { articles, departments, governanceUnits } from "@/lib/site-data";

// Every page in both languages, each entry pointing at its counterpart
// (hreflang) so search engines pair /about with /pt/about.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/departments",
    ...[...governanceUnits, ...departments].map((u) => `/departments/${u.slug}`),
    "/articles",
    ...articles.map((a) => `/articles/${a.slug}`),
    "/fund",
    "/alumni",
    "/partners",
    "/join",
  ];

  return paths.flatMap((path) => {
    const alternates = {
      languages: {
        en: absoluteUrl(localizePath("en", path)),
        "pt-PT": absoluteUrl(localizePath("pt", path)),
      },
    };
    return [
      { url: absoluteUrl(localizePath("en", path)), alternates },
      { url: absoluteUrl(localizePath("pt", path)), alternates },
    ];
  });
}
