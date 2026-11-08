"use client";

import type { CSSProperties } from "react";

import type { FundHolding } from "@/lib/fund-performance";
import { formatPercent } from "@/lib/fund-format";
import { useLanguage, useT } from "@/lib/language";

// A continuously scrolling strip of the fund's holdings, full-bleed under the
// /fund page header: ticker, name, weight, and the last day's move with an
// up/down arrow. The list is rendered twice (the second copy hidden from
// screen readers) so the CSS loop in globals.css (.ticker-track) is seamless.

const SECONDS_PER_HOLDING = 4;

function DayChange({ value }: { value: number | null | undefined }) {
  const { language } = useLanguage();
  const t = useT();
  if (value == null || !Number.isFinite(value)) return null;
  const rounded = Math.round(value * 10000);
  const direction = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  const tone =
    direction === "up" ? "text-emerald-700" : direction === "down" ? "text-red-700" : "text-foreground/50";
  return (
    <span className={`inline-flex items-baseline gap-1 text-sm font-semibold tabular-nums ${tone}`}>
      <span aria-hidden="true" className="text-[0.7em]">
        {direction === "up" ? "▲" : direction === "down" ? "▼" : "■"}
      </span>
      <span className="sr-only">
        {direction === "up"
          ? t("fund.ticker.up", "up")
          : direction === "down"
            ? t("fund.ticker.down", "down")
            : t("fund.ticker.flat", "unchanged")}
      </span>
      {formatPercent(Math.abs(value), language, { signed: false })}
    </span>
  );
}

export function HoldingsTicker({ holdings }: { holdings: FundHolding[] }) {
  const t = useT();
  const { language } = useLanguage();
  if (holdings.length === 0) return null;

  const items = (copy: boolean) =>
    holdings.map((holding) => (
      <li
        key={`${copy ? "copy-" : ""}${holding.ticker}`}
        className="flex shrink-0 items-baseline gap-2.5 border-r border-brand-navy/10 px-6 py-3.5"
        aria-hidden={copy || undefined}
      >
        <span className="text-sm font-bold tracking-wide">{holding.ticker}</span>
        <span className="max-w-48 truncate text-sm text-foreground/60">{holding.name}</span>
        <span className="text-sm text-foreground/60 tabular-nums">
          {formatPercent(holding.weight, language, { signed: false, digits: 1 })}
        </span>
        <DayChange value={holding.day_change} />
      </li>
    ));

  return (
    <section
      className="ticker relative flex border-b border-brand-navy/10 bg-brand-cream/50"
      aria-label={t("fund.tickerLabel", "Holdings: portfolio weight and last day's move")}
    >
      <div
        className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]"
        tabIndex={0}
      >
        <ul
          className="ticker-track flex w-max"
          style={{ "--ticker-duration": `${holdings.length * SECONDS_PER_HOLDING}s` } as CSSProperties}
        >
          {items(false)}
          {items(true)}
        </ul>
      </div>
    </section>
  );
}
