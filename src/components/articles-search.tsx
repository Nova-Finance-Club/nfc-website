"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/locale-link";
import { SharedElement } from "@/components/page-transition";
import { articles, departments } from "@/lib/site-data";
import { useLanguage, useT } from "@/lib/language";

export function ArticlesSearch() {
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  const t = useT();
  const { language } = useLanguage();
  const filterDepts = departments.filter((d) => articles.some((a) => a.department === d.slug));

  const titleOf = (a: (typeof articles)[number]) =>
    t(`article.${a.slug}.title`, a.title);

  const results = useMemo(() => {
    return articles.filter((a) => {
      const matchesQuery = t(`article.${a.slug}.title`, a.title)
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesDept = !deptFilter || a.department === deptFilter;
      return matchesQuery && matchesDept;
    });
  }, [query, deptFilter, t]);

  const deptLabel = (slug: string) => {
    const dept = departments.find((d) => d.slug === slug);
    return dept ? t(`dept.${dept.slug}.short`, dept.name.replace(" Department", "")) : slug;
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${iso}T00:00:00`));

  return (
    <>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("articles.searchPlaceholder", "Search articles...")}
            className="w-full rounded-md border bg-background py-2 pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {/* Department chips only for departments that actually have
            articles — a chip that always leads to "no results" is noise. */}
        {filterDepts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setDeptFilter(null)} className="cursor-pointer">
            <Badge variant={deptFilter === null ? "default" : "outline"}>
              {t("articles.all", "All")}
            </Badge>
          </button>
          {filterDepts.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => setDeptFilter(d.slug)}
              className="cursor-pointer"
            >
              <Badge variant={deptFilter === d.slug ? "default" : "outline"}>
                {t(`dept.${d.slug}.short`, d.name.replace(" Department", ""))}
              </Badge>
            </button>
          ))}
        </div>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/articles/${a.slug}`}
                className="group block overflow-hidden rounded-lg border transition-[border-color,box-shadow] duration-300 hover:border-brand-navy/40 hover:shadow-md"
              >
                <SharedElement name={`article-cover-${a.slug}`}>
                  <div className="relative aspect-[1080/1130] w-full overflow-hidden bg-brand-navy">
                    <Image
                      src={a.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                </SharedElement>
                <div className="p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {a.department
                      ? deptLabel(a.department)
                      : t("articles.genericLabel", "Article")}
                    {" · "}
                    {formatDate(a.date)}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    <span className="link-underline">{titleOf(a)}</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          {query || deptFilter
            ? t("articles.noMatch", "No articles match your search.")
            : t(
                "articles.noneYet",
                "No issues published yet. The first entries will appear here once they're published."
              )}
        </div>
      )}
    </>
  );
}
