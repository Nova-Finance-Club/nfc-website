import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { getFundPerformance } from "@/lib/fund-performance";
import { langFrom, pageMetadata } from "@/lib/seo";
import { FundContent } from "./fund-content";

// Re-read the fund's performance snapshot at most once an hour (keep in step
// with FUND_PERFORMANCE_REVALIDATE; route config must be a literal).
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[lang]/fund">): Promise<Metadata> {
  const lang = langFrom((await params).lang);
  return pageMetadata(lang, "/fund", {
    title: "NFC Fund",
    descriptionKey: "meta.fund.description",
    description:
      "The NFC Fund: the Investments Department's simulated portfolio, benchmarked against the S&P 500 and reported quarterly.",
  });
}

export default async function Page() {
  const performance = await getFundPerformance();
  return (
    <PageTransition>
      <FundContent performance={performance} />
    </PageTransition>
  );
}
