"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";

import { ArticleComments } from "@/components/article-comments";
import { Link } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion-primitives";
import { SharedElement } from "@/components/page-transition";
import {
  articles,
  departments,
  memberFaceCenter,
  memberLinkedIn,
  memberPhotos,
  swayEmbedUrl,
  type Article,
} from "@/lib/site-data";
import { useLanguage, useT } from "@/lib/language";

export function formatArticleDate(iso: string, language: string) {
  return new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}

// The Sway is a cross-origin iframe: its wheel and touch events never
// reach this page, and whatever scroll the Sway doesn't consume chains out
// and scrolls the article page behind it. The page doesn't even get
// mouseenter/mouseleave for the iframe, so it can't tell when the pointer
// is inside. Hence the usual embedded-map pattern: a transparent shield
// covers the Sway (scrolling over it scrolls the page, as normal); clicking
// it hands input to the Sway and locks the page's own scroll; the first
// pointer event back on this page — i.e. the pointer has left the Sway —
// unlocks it and puts the shield back.
function useSwayFocus() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const previous = { overflow: html.style.overflow, gutter: html.style.scrollbarGutter };
    // Reserve the scrollbar's space so the page doesn't shift sideways.
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
    // Ignore events aimed at the iframe itself and the zero-distance
    // "fake" move the browser can fire when the shield disappears from
    // under a still pointer.
    const release = (e: PointerEvent) => {
      if (e.target instanceof HTMLIFrameElement) return;
      if (e.type === "pointermove" && e.movementX === 0 && e.movementY === 0) return;
      setActive(false);
    };
    document.addEventListener("pointermove", release);
    document.addEventListener("pointerdown", release);
    return () => {
      html.style.overflow = previous.overflow;
      html.style.scrollbarGutter = previous.gutter;
      document.removeEventListener("pointermove", release);
      document.removeEventListener("pointerdown", release);
    };
  }, [active]);

  return { active, activate: () => setActive(true) };
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
  const sway = useSwayFocus();
  // Image posts: the version in the visitor's language, shown and downloadable.
  const postSrc = article.post ? (language === "pt" ? article.post.pt : article.post.en) : null;
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

          {/* An image post is shown in full below, so it gets no cover here;
              its authors sit in a column to the right of the title instead. */}
          <div
            className={
              article.post
                ? "mt-8 grid gap-10 md:grid-cols-[1fr_auto] md:items-center lg:gap-16"
                : "mt-8 grid items-center gap-10 md:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16"
            }
          >
            {!article.post && (
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
            )}

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
              {!article.post && article.authors && article.authors.length > 0 && (
                <p className="mt-5 text-sm text-foreground/80">
                  {t("article.by", "By")} {article.authors.join(", ")}
                </p>
              )}
              {postSrc && (
                <div className="mt-7">
                  <Button
                    nativeButton={false}
                    render={<a href={postSrc} download={`NFC - ${title}.png`} />}
                    className="group"
                  >
                    <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
                    {t("article.download", "Download")}
                  </Button>
                </div>
              )}
              {article.url && (
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
              )}
            </Reveal>

            {article.post && article.authors && article.authors.length > 0 && (
              <Reveal immediate>
                <aside className="flex flex-col gap-8 border-t border-brand-navy/15 pt-8 md:border-t-0 md:border-l md:py-2 md:pl-12">
                  {article.authors.map((name) => (
                    <div key={name} className="flex items-center gap-5 md:flex-col md:items-start">
                      {memberPhotos[name] && (
                        // Team photos are waist-up: a head-and-shoulders
                        // portrait, the face point placed at the centre of
                        // the frame (translate % is of the image's own size).
                        <div className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-lg bg-brand-navy shadow-sm md:w-32">
                          <Image
                            src={memberPhotos[name]}
                            alt=""
                            width={1200}
                            height={800}
                            className="absolute top-1/2 left-1/2 h-[200%] w-auto max-w-none"
                            style={{
                              transform: `translate(-${memberFaceCenter[name]?.x ?? 50}%, -${memberFaceCenter[name]?.y ?? 33}%)`,
                            }}
                            sizes="(min-width: 768px) 480px, 360px"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">{t("article.by", "By")}</p>
                        <p className="font-heading text-lg leading-snug font-bold md:text-xl">{name}</p>
                        {dept && (
                          <p className="text-sm text-foreground/70">
                            {t(`dept.${dept.slug}.short`, dept.name.replace(/ Department$/, ""))}
                          </p>
                        )}
                        {memberLinkedIn[name] && (
                          <a
                            href={memberLinkedIn[name]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-2 inline-flex items-center gap-1 text-sm"
                          >
                            <span className="link-underline">LinkedIn</span>
                            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </aside>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {postSrc && (
        <section className="mx-auto max-w-2xl px-6 py-12">
          <Image
            src={postSrc}
            alt={article.postAlt ? t(`article.${article.slug}.postAlt`, article.postAlt) : ""}
            width={1890}
            height={2363}
            priority
            className="h-auto w-full rounded-lg border shadow-sm"
            sizes="(min-width: 672px) 624px, 100vw"
          />
        </section>
      )}

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
            {!sway.active && (
              <button
                type="button"
                onClick={sway.activate}
                className="group absolute inset-0 flex cursor-pointer items-center justify-center outline-none"
              >
                <span className="rounded-full bg-brand-navy/90 px-4 py-2 text-sm text-brand-cream opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {t("article.swayActivate", "Click to scroll the Sway")}
                </span>
              </button>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t("article.swayNote", "Published on Microsoft Sway, in Portuguese.")}
          </p>
        </section>
      )}

      <ArticleComments article={article} title={title} />

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
