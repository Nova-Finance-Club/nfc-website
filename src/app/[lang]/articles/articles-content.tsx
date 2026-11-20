"use client";

import { ArticlesSearch } from "@/components/articles-search";
import { PageHeader } from "@/components/page-header";
import { BracketWordmark } from "@/components/bracket-wordmark";
import { useT } from "@/lib/language";

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

      <div className="mx-auto max-w-7xl px-6 pt-2 pb-16">
        <ArticlesSearch />
      </div>
    </div>
  );
}
