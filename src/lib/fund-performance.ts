// The NFC Fund's live track record, for the /fund page.
//
// The fund platform (NOVA-Finance-Club/NFC_Fund, private) builds a public-safe
// snapshot — `python nfc_public.py build`, run by its fund-publish.yml
// workflow — and saves it as fund-performance.json on its `public-data`
// branch. The page reads that file here, on the server only, with a
// fine-grained read-only GitHub token:
//
//   FUND_DATA_TOKEN       required in production (Vercel). Without it, or if
//                         the fetch fails, the page falls back to describing
//                         the fund without figures.
//   FUND_DATA_REPO        optional, default "Nova-Finance-Club/NFC_Fund".
//   FUND_DATA_BRANCH      optional, default "public-data".
//   FUND_PERFORMANCE_FILE optional local path to a snapshot, for development.
//
// Keep FundPerformance in step with nfc_public.py (SCHEMA_VERSION).

import { readFile } from "node:fs/promises";

export const FUND_PERFORMANCE_SCHEMA = 1;

/** How often (seconds) the page re-reads the snapshot. Kept short: Vercel caches
 *  the fetched file and the rendered page separately, so a new snapshot can take
 *  up to twice this long to show. One GitHub API call per interval is nothing. */
export const FUND_PERFORMANCE_REVALIDATE = 300;

export type FundSeriesPoint = {
  date: string; // YYYY-MM-DD
  fund: number | null; // growth of 100 since inception
  benchmark: number | null;
};

export type FundHolding = {
  ticker: string;
  name: string;
  sector: string;
  geography: string;
  weight: number | null; // 0–1
  day_change?: number | null; // last close vs previous, in EUR
};

export type FundAllocation = { label: string; weight: number | null };

export type FundPerformance = {
  schema: number;
  generated_at: string;
  as_of: string;
  inception_date: string;
  trading_days: number;
  currency: string;
  nav: number | null;
  inception_nav: number | null;
  cash_weight: number | null;
  returns: {
    since_inception: number | null;
    ytd: number | null;
    last_day: number | null;
    max_drawdown: number | null;
  };
  // Annualised; null until the track record has min_days daily returns.
  risk?: { volatility: number | null; sharpe: number | null; risk_free_rate: number | null; min_days: number };
  benchmark: { ticker: string; name: string; since_inception: number | null } | null;
  series: FundSeriesPoint[];
  holdings: FundHolding[];
  allocation: { sector: FundAllocation[]; geography: FundAllocation[] };
};

function isFundPerformance(value: unknown): value is FundPerformance {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<FundPerformance>;
  return (
    data.schema === FUND_PERFORMANCE_SCHEMA &&
    typeof data.as_of === "string" &&
    typeof data.inception_date === "string" &&
    Array.isArray(data.series) &&
    data.series.length > 1 &&
    Array.isArray(data.holdings) &&
    typeof data.returns === "object" &&
    typeof data.allocation === "object"
  );
}

/** The latest snapshot, or null when there isn't one to show. Never throws. */
export async function getFundPerformance(): Promise<FundPerformance | null> {
  try {
    const localFile = process.env.FUND_PERFORMANCE_FILE;
    if (localFile) {
      const data: unknown = JSON.parse(await readFile(localFile, "utf8"));
      return isFundPerformance(data) ? data : null;
    }

    const token = process.env.FUND_DATA_TOKEN;
    if (!token) {
      console.warn("[fund-performance] FUND_DATA_TOKEN is not set; showing the page without figures.");
      return null;
    }
    const repo = process.env.FUND_DATA_REPO || "Nova-Finance-Club/NFC_Fund";
    const branch = process.env.FUND_DATA_BRANCH || "public-data";
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/fund-performance.json?ref=${encodeURIComponent(branch)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.raw+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "nfc-website",
        },
        next: { revalidate: FUND_PERFORMANCE_REVALIDATE, tags: ["fund-performance"] },
      }
    );
    if (!response.ok) {
      console.warn(`[fund-performance] GitHub returned ${response.status}; showing the page without figures.`);
      return null;
    }
    const data: unknown = await response.json();
    if (!isFundPerformance(data)) {
      console.warn("[fund-performance] Unexpected snapshot schema; showing the page without figures.");
      return null;
    }
    return data;
  } catch (error) {
    console.warn("[fund-performance] Could not load the snapshot:", error);
    return null;
  }
}
