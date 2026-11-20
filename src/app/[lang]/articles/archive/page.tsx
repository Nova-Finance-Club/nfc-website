import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { ArchiveContent } from "./archive-content";

export async function generateMetadata({ params }: PageProps<"/[lang]/articles/archive">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/articles/archive", {
    title: "Archive",
    titleKey: "meta.archive.title",
    descriptionKey: "meta.archive.description",
    description: "Earlier Rubrica NFC articles published by Nova Finance Club.",
  });
}

export default function Page() {
  return (
    <PageTransition>
      <ArchiveContent />
    </PageTransition>
  );
}
