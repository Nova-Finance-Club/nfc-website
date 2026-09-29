import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { PartnersContent } from "./partners-content";

export async function generateMetadata({ params }: PageProps<"/[lang]/partners">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/partners", {
    title: "Partner with us",
    titleKey: "meta.partners.title",
    descriptionKey: "meta.partners.description",
    description:
      "Work with Nova Finance Club: reach NOVA FCT students in mathematics, engineering and data through events, challenges, recruiting and visibility.",
  });
}

export default function Page() {
  return (
    <PageTransition>
      <PartnersContent />
    </PageTransition>
  );
}
