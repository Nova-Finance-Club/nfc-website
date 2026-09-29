import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { ArticlesContent } from "./articles-content";

export async function generateMetadata({ params }: PageProps<"/[lang]/articles">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/articles", {
    title: "Articles",
    titleKey: "meta.articles.title",
    descriptionKey: "meta.articles.description",
    description:
      "Articles and market analysis published by Nova Finance Club members.",
  });
}

export default function Page() {
  return (
    <PageTransition>
      <ArticlesContent />
    </PageTransition>
  );
}
