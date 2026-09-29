"use client";

import { Link } from "@/components/locale-link";

import { ArticlesSearch } from "@/components/articles-search";
import { PageHeader } from "@/components/page-header";
import { BracketWordmark } from "@/components/bracket-wordmark";
import { departments } from "@/lib/site-data";
import { useT } from "@/lib/language";

// Short department names for the inline list below — the full dept.name
// values end in "Department", which reads fine as a page title but not
// strung together four times in one sentence. Matches the short labels
// already used for these departments on the Join page.
const shortDeptName: Record<string, string> = {
  "events-external-relations": "Events & External Relations",
  "personal-finance": "Personal Finance",
  investment: "Investments",
  "quantitative-trading": "Quantitative Trading",
};

export function ArticlesContent() {
  const t = useT();

  return (
    <div>
      <PageHeader
        title={<BracketWordmark text={t("articles.heading", "Articles")} />}
        subtitle={t(
          "articles.subtitle",
          "Recurring editorial series and market reports, published by NFC's departments."
        )}
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-muted-foreground">
          {t(
            "articles.introStart",
            "Search NFC's published articles and reports, from the"
          )}{" "}
          {departments.map((d, i) => (
            <span key={d.slug}>
              {i > 0 &&
                (i === departments.length - 1
                  ? ` ${t("articles.introAnd", "and")} `
                  : ", ")}
              <Link
                href={`/departments/${d.slug}`}
                className="underline underline-offset-4"
              >
                {t(`dept.${d.slug}.short`, shortDeptName[d.slug] ?? d.name)}
              </Link>
            </span>
          ))}
          .
        </p>

        <ArticlesSearch />
      </div>
    </div>
  );
}
