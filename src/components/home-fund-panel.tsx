"use client";

import { useId, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { Link } from "@/components/locale-link";
import { Reveal } from "@/components/motion-primitives";
import type { FundPerformance } from "@/lib/fund-performance";
import { formatDate, formatMoney, formatPercent, formatPoints } from "@/lib/fund-format";
import { useLanguage, useT } from "@/lib/language";
import { siteConfig } from "@/lib/site-data";

// The NFC Fund on the home page, as a navy band in the club's editorial
// style (navy and cream, Libre Baskerville, hairlines, one large numeral):
// the section heading, then the cumulative return set large with the
// supporting figures under it in a hairline list, and beside them a wide
// line of the fund since inception with the benchmark dashed in gold. Full
// detail stays on /fund; without a snapshot the band keeps the heading,
// description and link.

const GOLD = "#c99a52";

export function HomeFundPanel({ performance }: { performance: FundPerformance | null }) {
  const t = useT();
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-brand-navy text-brand-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <h2 className="font-heading text-4xl font-bold tracking-normal sm:text-5xl">
              {t("home.fundHeading", "{shortName} Fund", { shortName: siteConfig.shortName })}
            </h2>
            <p className="mt-2 max-w-2xl text-brand-cream/70">
              {t(
                "home.fundSubtitle",
                "The Investments Department's virtual fund. Mandate, methodology and quarterly reporting."
              )}
            </p>
          </div>
          <Link
            href="/fund"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-cream/85 transition-colors hover:text-brand-cream"
          >
            <span className="link-underline">{t("home.seeFund", "See the fund")}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        {performance && (
          <div className="mt-12 grid gap-12 border-t border-brand-cream/15 pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-12">
            <Reveal delay={0.05} className="lg:col-span-4">
              <p className="font-heading text-7xl leading-none font-bold tracking-tight tabular-nums sm:text-8xl">
                {formatPercent(performance.returns.since_inception, language)}
              </p>
              <p className="mt-4 text-sm text-brand-cream/65">
                {t("home.fund.cumulative", "Cumulative return since inception")}
                <br />
                {t("fund.performanceAsOf", "As of {asOf}", { asOf: formatDate(performance.as_of, language) })}
              </p>
              <Stats performance={performance} />
            </Reveal>

            {performance.series.length > 1 && (
              <Reveal delay={0.12} className="lg:col-span-8 lg:self-end">
                <Chart performance={performance} />
              </Reveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Stats({ performance }: { performance: FundPerformance }) {
  const t = useT();
  const { language } = useLanguage();
  const benchmark = performance.benchmark;
  const fundReturn = performance.returns.since_inception;
  const difference =
    fundReturn != null && benchmark?.since_inception != null ? fundReturn - benchmark.since_inception : null;

  const stats = [
    benchmark && {
      label: t("fund.stat.vsBenchmark", "vs. {benchmark}", { benchmark: benchmark.name }),
      value: formatPoints(difference, language),
    },
    {
      label: t("fund.stat.nav", "Net asset value"),
      value: formatMoney(performance.nav, language, performance.currency),
    },
    performance.returns.max_drawdown != null && {
      label: t("fund.stat.maxDrawdown", "Max drawdown"),
      value: formatPercent(performance.returns.max_drawdown, language),
    },
    performance.risk?.volatility != null && {
      label: t("home.fund.volatility", "Volatility"),
      value: formatPercent(performance.risk.volatility, language, { signed: false, digits: 1 }),
    },
    performance.risk?.sharpe != null && {
      label: t("fund.stat.sharpe", "Sharpe ratio"),
      value: performance.risk.sharpe.toFixed(2),
    },
  ].filter((s): s is { label: string; value: string } => Boolean(s));

  return (
    <dl className="mt-8 divide-y divide-brand-cream/15 border-y border-brand-cream/15">
      {stats.map((s) => (
        <div key={s.label} className="flex items-baseline justify-between gap-6 py-3">
          <dt className="text-sm text-brand-cream/65">{s.label}</dt>
          <dd className="font-heading text-lg font-bold whitespace-nowrap tabular-nums">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Cumulative return of the fund (solid cream) and benchmark (dashed gold)
// since inception, stretched to the column's width. Strokes keep their width
// under the stretch (non-scaling-stroke). The chart reveals left to right
// once, when it scrolls into view.
function Chart({ performance }: { performance: FundPerformance }) {
  const t = useT();
  const { language } = useLanguage();
  const reduce = useReducedMotion();
  const figureRef = useRef<HTMLElement>(null);
  const inView = useInView(figureRef, { once: true, amount: 0.4 });
  const id = useId().replace(/:/g, "");
  const W = 1000;
  const H = 320;
  const PAD = 12;
  const series = performance.series;
  const values = series
    .flatMap((p) => [p.fund, p.benchmark])
    .filter((v): v is number => v != null)
    .map((v) => v / 100 - 1);
  const low = Math.min(0, ...values);
  const high = Math.max(0, ...values);
  const span = high - low || 0.01;
  const x = (i: number) => (i / (series.length - 1)) * W;
  const y = (v: number) => PAD + ((high - v) / span) * (H - 2 * PAD);
  const zero = y(0);

  const line = (key: "fund" | "benchmark") => {
    let d = "";
    let pen = false;
    series.forEach((p, i) => {
      const v = p[key];
      if (v == null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v / 100 - 1).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  const fundPoints = series
    .map((p, i) => [i, p.fund] as const)
    .filter((p): p is readonly [number, number] => p[1] != null);
  const fundLine = line("fund");
  const area =
    fundPoints.length > 1
      ? `${fundLine}L${x(fundPoints[fundPoints.length - 1][0])},${zero}L${x(fundPoints[0][0])},${zero}Z`
      : "";
  // A clip on the whole chart rather than pathLength: pathLength dashes are
  // measured before the stretch, so with non-scaling-stroke the line would
  // stay hidden. The props are identical on server and client
  // (useReducedMotion is only known in the browser, and branching the props
  // on it breaks hydration); reduced motion just makes the reveal instant.
  const reveal = {
    initial: { clipPath: "inset(0 100% 0 0)" },
    animate: { clipPath: inView || reduce ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" },
    transition: reduce ? { duration: 0 } : { duration: 1.6, ease: [0.16, 1, 0.3, 1] as const },
  };
  // Where 0% sits, as a share of the chart's height, for its HTML label.
  const zeroTop = `${(zero / H) * 100}%`;

  return (
    <figure ref={figureRef}>
      <div className="relative">
        <motion.div {...reveal}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="block h-52 w-full overflow-visible sm:h-72"
            role="img"
            aria-label={t(
              "fund.chart.summary",
              "Cumulative return since inception: {fundName} {fund}{benchmarkPart}, from {start} to {end}.",
              {
                fundName: t("fund.chart.fund", "NFC Fund"),
                fund: formatPercent(performance.returns.since_inception, language),
                benchmarkPart: performance.benchmark
                  ? `, ${performance.benchmark.name} ${formatPercent(performance.benchmark.since_inception, language)}`
                  : "",
                start: formatDate(performance.inception_date, language),
                end: formatDate(performance.as_of, language),
              }
            )}
          >
            <defs>
              <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-cream)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="var(--brand-cream)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <line
              x1="0"
              x2={W}
              y1={zero}
              y2={zero}
              stroke="var(--brand-cream)"
              strokeOpacity="0.25"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {area && <path d={area} fill={`url(#${id}-fill)`} />}
            {performance.benchmark && (
              <path
                d={line("benchmark")}
                fill="none"
                stroke={GOLD}
                strokeWidth="1.5"
                strokeDasharray="6 5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
            <path
              d={fundLine}
              fill="none"
              stroke="var(--brand-cream)"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </motion.div>
        <span
          className="pointer-events-none absolute right-0 -translate-y-full pb-1 text-xs text-brand-cream/55"
          style={{ top: zeroTop }}
        >
          0%
        </span>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-brand-cream/15 pt-4 text-xs text-brand-cream/65">
        <span className="flex items-center gap-5">
          <span className="flex items-center gap-2">
            <span className="inline-block h-0.5 w-5 rounded-full bg-brand-cream" />
            {t("fund.chart.fund", "NFC Fund")}
          </span>
          {performance.benchmark && (
            <span className="flex items-center gap-2">
              <svg width="20" height="4" aria-hidden="true">
                <line x1="1" y1="2" x2="19" y2="2" stroke={GOLD} strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>
              {performance.benchmark.name}
            </span>
          )}
        </span>
        <span>
          {t("home.fund.period", "{start} to {end}", {
            start: formatDate(performance.inception_date, language),
            end: formatDate(performance.as_of, language),
          })}
        </span>
      </figcaption>
    </figure>
  );
}
