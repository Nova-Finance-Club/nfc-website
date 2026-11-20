"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Link } from "@/components/locale-link";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { SharedElement } from "@/components/page-transition";
import { formatArticleDate } from "@/app/[lang]/articles/[slug]/article-content";
import { articleCover, articles, departments, type Article } from "@/lib/site-data";
import { useLanguage, useT } from "@/lib/language";

// The home page's window onto the articles: the three newest, side by side
// at the same size, each led by its series cover so the banners carry the
// section the way they do in the archive. One column on phones.

const SHOWN = 3;

export function HomeLatestArticles() {
  const t = useT();
  const latest = articles.slice(0, SHOWN);

  return (
    <section className="py-16 sm:py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h2 className="font-heading text-4xl font-bold tracking-normal sm:text-5xl">
            {t("home.articlesHeading", "Latest Articles")}
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {t(
              "home.articlesSubtitle",
              "Recurring editorial series and markets reports, published across departments."
            )}
          </p>
        </div>
        {latest.length > 0 && (
          <Link href="/articles" className="group inline-flex items-center gap-1.5 text-sm font-medium">
            <span className="link-underline">{t("home.browseArchive", "Browse the archive")}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        )}
      </Reveal>

      {latest.length === 0 ? (
        <Reveal
          delay={0.1}
          className="mt-8 rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground"
        >
          {t("home.articlesEmpty", "No articles published yet.")}
        </Reveal>
      ) : (
        <StaggerGroup className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article) => (
            <StaggerItem key={article.slug} className="h-full">
              <ArticleCard article={article} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const t = useT();
  const { language } = useLanguage();
  const dept = article.department ? departments.find((d) => d.slug === article.department) : null;
  const title = t(`article.${article.slug}.title`, article.title);
  const summary = article.summary ? t(`article.${article.slug}.summary`, article.summary) : null;
  const label = dept
    ? t(`dept.${dept.slug}.short`, dept.name.replace(/ Department$/, ""))
    : t("articles.genericLabel", "Article");

  return (
    <Link href={`/articles/${article.slug}`} className="group flex h-full flex-col">
      <SharedElement name={`article-cover-${article.slug}`}>
        <div className="relative aspect-[1080/1130] w-full overflow-hidden rounded-xl bg-brand-navy shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
          <Image
            src={articleCover(article, language)}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      </SharedElement>
      <p className="mt-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label} · <time dateTime={article.date}>{formatArticleDate(article.date, language)}</time>
      </p>
      <h3 className="mt-2 font-heading text-xl leading-snug font-bold tracking-normal sm:text-2xl">
        <span className="link-underline">{title}</span>
      </h3>
      {summary && <p className="mt-2 line-clamp-3 leading-relaxed text-foreground/75">{summary}</p>}
      {article.authors && article.authors.length > 0 && (
        <p className="mt-auto pt-3 text-sm text-foreground/70">
          {t("article.by", "By")} {article.authors.join(", ")}
        </p>
      )}
    </Link>
  );
}
