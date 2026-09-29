import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { langFrom, pageMetadata } from "@/lib/seo";
import { FundContent } from "./fund-content";

export async function generateMetadata({ params }: PageProps<"/[lang]/fund">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/fund", {
    title: "NFC Fund",
    descriptionKey: "meta.fund.description",
    description:
      "The NFC Fund: the Investments Department's simulated portfolio, benchmarked against the S&P 500 and reported quarterly.",
  });
}

export default function Page() {
  return (
    <PageTransition>
      <FundContent />
    </PageTransition>
  );
}
