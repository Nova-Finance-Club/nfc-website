"use client";

import { ArrowLeft } from "lucide-react";

import { ArticlesSearch } from "@/components/articles-search";
import { BracketWordmark } from "@/components/bracket-wordmark";
import { Link } from "@/components/locale-link";
import { PageHeader } from "@/components/page-header";
import { archivedArticles } from "@/lib/site-data";
import { useT } from "@/lib/language";

// The Archive: earlier Rubrica NFC pieces, kept out of the main Articles
// list and the home page but still searchable here, each on its own page.
export function ArchiveContent() {
  const t = useT();

  return (
    <div>
      <PageHeader
        title={<BracketWordmark text={t("articles.archive", "Archive")} />}
        subtitle={t("articles.archiveSubtitle", "Earlier Rubrica NFC articles.")}
      />

      <div className="mx-auto max-w-7xl px-6 pt-8 pb-16">
        <Link
          href="/articles"
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          {t("article.back", "Articles")}
        </Link>
        <ArticlesSearch articles={archivedArticles} />
      </div>
    </div>
  );
}
