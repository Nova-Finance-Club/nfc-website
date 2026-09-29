import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { HomeContent } from "./home-content";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/", {
    descriptionKey: "meta.site.description",
    description:
      "Nova Finance Club (NFC) is the student-run finance club of NOVA School of Science and Technology (NOVA FCT): a virtual investment fund, quantitative finance projects, market analysis and events.",
  });
}

export default function Page() {
  return (
    <PageTransition>
      <HomeContent />
    </PageTransition>
  );
}
