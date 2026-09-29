"use client";

import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Link } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion-primitives";
import { SharedElement } from "@/components/page-transition";
import { articles, departments, swayEmbedUrl, type Article } from "@/lib/site-data";
import { useLanguage, useT } from "@/lib/language";

export function formatArticleDate(iso: string, language: string) {
  return new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}

// Each article gets its own page on the site — title, date, abstract and
// byline live here (indexable, shareable) — with the Sway itself embedded
// below, instead of the archive sending readers straight off-site.
export function ArticleContent({ article }: { article: Article }) {
  const t = useT();
  const { language } = useLanguage();
  const title = t(`article.${article.slug}.title`, article.title);
  const summary = article.summary ? t(`article.${article.slug}.summary`, article.summary) : null;
  const embed = swayEmbedUrl(article.url);
  const dept = article.department ? departments.find((d) => d.slug === article.department) : null;
  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article>
      <section className="border-b bg-brand-cream/40">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <Link
            href="/articles"
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            {t("article.back", "Articles")}
          </Link>

          <div className="mt-8 grid items-center gap-10 md:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
            <SharedElement name={`article-cover-${article.slug}`}>
              <div className="relative aspect-[1080/1130] w-full max-w-xs overflow-hidden rounded-lg bg-brand-navy shadow-sm md:max-w-none">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 768px) 320px, 100vw"
                />
              </div>
            </SharedElement>

            <Reveal immediate>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {dept
                  ? t(`dept.${dept.slug}.short`, dept.name.replace(/ Department$/, ""))
                  : t("articles.genericLabel", "Article")}
                {" · "}
                <time dateTime={article.date}>{formatArticleDate(article.date, language)}</time>
              </p>
              <h1 className="mt-3 font-heading text-3xl leading-tight font-bold tracking-normal sm:text-5xl">
                {title}
              </h1>
              {summary && (
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/80">{summary}</p>
              )}
              {article.authors && article.authors.length > 0 && (
                <p className="mt-5 text-sm text-foreground/80">
                  {t("article.by", "By")} {article.authors.join(", ")}
                </p>
              )}
              <div className="mt-7">
                <Button
                  nativeButton={false}
                  render={<a href={article.url} target="_blank" rel="noopener noreferrer" />}
                  className="group"
                >
                  {t("article.openInSway", "Open in Sway")}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {embed && (
        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="relative overflow-hidden rounded-lg border bg-brand-cream/30">
            {/* Shows until the embedded Sway paints over it. */}
            <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-foreground/60">
              {t("article.loading", "Loading the Sway…")}
            </p>
            <iframe
              src={embed}
              title={title}
              loading="lazy"
              className="relative block h-[75vh] min-h-[480px] w-full"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t("article.swayNote", "Published on Microsoft Sway, in Portuguese.")}
          </p>
        </section>
      )}

      {others.length > 0 && (
        <section className="border-t">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <h2 className="font-heading text-2xl font-bold tracking-normal">
              {t("article.moreHeading", "More articles")}
            </h2>
            <ul className="mt-6 divide-y border-y">
              {others.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-4"
                  >
                    <span className="font-medium link-underline">
                      {t(`article.${a.slug}.title`, a.title)}
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {formatArticleDate(a.date, language)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
