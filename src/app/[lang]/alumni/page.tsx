import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { AlumniContent } from "./alumni-content";

export async function generateMetadata({ params }: PageProps<"/[lang]/alumni">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/alumni", {
    title: "Alumni",
    titleKey: "meta.alumni.title",
    descriptionKey: "meta.alumni.description",
    description:
      "Nova Finance Club's past elected leadership, mandate by mandate.",
  });
}

export default function Page() {
  return (
    <PageTransition>
      <AlumniContent />
    </PageTransition>
  );
}
