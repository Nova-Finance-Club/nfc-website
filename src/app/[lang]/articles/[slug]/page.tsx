import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { translate } from "@/lib/i18n";
import { absoluteUrl, langFrom, pageMetadata } from "@/lib/seo";
import { articles } from "@/lib/site-data";
import { ArticleContent } from "./article-content";

type Props = PageProps<"/[lang]/articles/[slug]">;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = langFrom(raw);
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  const title = translate(lang, `article.${slug}.title`, article.title);
  const base = pageMetadata(lang, `/articles/${slug}`, {
    title,
    descriptionKey: `article.${slug}.summary`,
    description: article.summary ?? title,
  });
  // The article's own cover is a better share image than the site default.
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.date,
      images: [{ url: absoluteUrl(article.image) }],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <PageTransition>
      <ArticleContent article={article} />
    </PageTransition>
  );
}
