import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { memberDegrees, siteConfig } from "@/lib/site-data";
import { AboutContent } from "./about-content";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  const distinctBackgrounds = new Set(Object.values(memberDegrees).map((d) => d.name)).size;
  return pageMetadata(lang, "/about", {
    title: "About Us",
    titleKey: "meta.about.title",
    descriptionKey: "meta.about.description",
    description:
      "How Nova Finance Club started, what it's for, and who its members are: {memberCount} students from {distinctBackgrounds} degree programmes at NOVA FCT.",
    vars: { memberCount: siteConfig.memberCount, distinctBackgrounds },
  });
}

export default function Page() {
  return (
    <PageTransition>
      <AboutContent />
    </PageTransition>
  );
}
