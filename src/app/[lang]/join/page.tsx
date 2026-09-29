import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { JoinContent } from "./join-content";

export async function generateMetadata({ params }: PageProps<"/[lang]/join">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/join", {
    title: "Join Us",
    titleKey: "meta.join.title",
    descriptionKey: "meta.join.description",
    description:
      "How to join Nova Finance Club: who can apply, what each department looks for, the recruitment process and FAQs. Next recruitment: Spring 2027.",
  });
}

export default function Page() {
  return (
    <PageTransition>
      <JoinContent />
    </PageTransition>
  );
}
