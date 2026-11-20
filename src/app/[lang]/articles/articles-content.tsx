"use client";

import { Archive } from "lucide-react";

import { ArticlesSearch } from "@/components/articles-search";
import { BracketWordmark } from "@/components/bracket-wordmark";
import { Link } from "@/components/locale-link";
import { PageHeader } from "@/components/page-header";
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
        <ArticlesSearch
          action={
            <Link
              href="/articles/archive"
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand-navy/40 hover:bg-brand-cream/40 sm:self-auto"
            >
              <Archive className="size-4" />
              {t("articles.archive", "Archive")}
            </Link>
          }
        />
      </div>
    </div>
  );
}
