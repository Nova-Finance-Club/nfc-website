"use client";

import { ArrowRight } from "lucide-react";

import { Link } from "@/components/locale-link";
import { PageHeader } from "@/components/page-header";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { BracketWordmark } from "@/components/bracket-wordmark";
import { FundPerformanceChart } from "@/components/fund-performance-chart";
import { HoldingsTicker } from "@/components/holdings-ticker";
import type { FundAllocation, FundPerformance } from "@/lib/fund-performance";
import { formatDate, formatMoney, formatPercent, formatPoints } from "@/lib/fund-format";
import { useLanguage, useT } from "@/lib/language";
import { departments, nfcFund, siteConfig } from "@/lib/site-data";

// The performance section comes from the fund platform's public snapshot
// (see lib/fund-performance.ts). When there is none — no token configured, or
// GitHub unreachable — the page still describes the fund (mandate, method,
// reporting, team) instead of showing an empty chart and dashes.
const investments = departments.find((d) => d.slug === "investment");

export function FundContent({ performance }: { performance: FundPerformance | null }) {
  const t = useT();
  const { language } = useLanguage();

  const facts = [
    { label: t("fund.fact.type", "Type"), value: t("fund.fact.typeValue", "Simulated, educational portfolio") },
    { label: t("fund.fact.benchmark", "Benchmark"), value: nfcFund.benchmark },
    {
      label: t("fund.fact.managedBy", "Managed by"),
      value: t("dept.investment.name", "Investments Department"),
      href: "/departments/investment",
    },
    { label: t("fund.fact.reporting", "Reporting"), value: t("fund.fact.reportingValue", "Quarterly, on LinkedIn") },
    performance
      ? { label: t("fund.fact.inception", "Inception"), value: formatDate(performance.inception_date, language) }
      : {
          label: t("fund.fact.start", "Start"),
          value: t("fund.fact.startValue", "{mandate} mandate", { mandate: siteConfig.mandate }),
        },
    ...(performance
      ? [{ label: t("fund.fact.startingCapital", "Starting capital"), value: formatMoney(performance.inception_nav, language, performance.currency) }]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title={<BracketWordmark text={nfcFund.name} />}
        subtitle={t("fund.subtitle", "A simulated portfolio for real investment practice.")}
      />

      {performance && <HoldingsTicker holdings={performance.holdings} />}

      <div className="mx-auto max-w-7xl px-6 py-16">
        {performance ? (
          <PerformanceSection performance={performance} />
        ) : (
          <Reveal className="mx-auto flex max-w-3xl items-start gap-3 rounded-lg border border-brand-navy/15 bg-brand-cream/40 px-5 py-4 text-sm text-foreground/80">
            <span className="relative mt-1.5 flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-navy/40 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-navy" />
            </span>
            <p>
              {t(
                "fund.status",
                "Launching with the {mandate} mandate. Performance figures and the first NFC Performance Report will be published here after the fund's first quarter.",
                { mandate: siteConfig.mandate }
              )}
            </p>
          </Reveal>
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <Reveal>
              <h2 className="font-heading text-2xl font-bold tracking-normal">
                {t("fund.mandateHeading", "Mandate")}
              </h2>
              <p className="mt-3 leading-relaxed text-foreground/80">
                {t("fund.mandateBody", nfcFund.mandate)}{" "}
                {t("fund.benchmarkNote", "Benchmarked against the {benchmark}.", {
                  benchmark: nfcFund.benchmark,
                })}
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-heading text-2xl font-bold tracking-normal">
                {t("fund.howHeading", "How it works")}
              </h2>
              <StaggerGroup className="mt-5 space-y-4">
                {[
                  t("fund.how.0", "An initial allocation is set at the start of the mandate."),
                  t(
                    "fund.how.1",
                    "The fund is split between coverage teams (for example Iberia & Europe, Emerging Markets and Global Macro), each managing its own portion."
                  ),
                  t(
                    "fund.how.2",
                    "Every quarter, the {reportName} sets out the fund's return against the {benchmark}.",
                    { reportName: nfcFund.report.name, benchmark: nfcFund.benchmark }
                  ),
                ].map((line, i) => (
                  <StaggerItem key={i} className="flex gap-4">
                    <span className="w-9 shrink-0 font-heading text-2xl leading-none font-bold text-brand-navy/25 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="leading-relaxed text-foreground/80">{line}</p>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </Reveal>

            {investments && (
              <Reveal>
                <h2 className="font-heading text-2xl font-bold tracking-normal">
                  {t("fund.teamHeading", "Team")}
                </h2>
                <p className="mt-3 leading-relaxed text-foreground/80">
                  {t(
                    "fund.teamBody",
                    "Run by the Investments Department's {count} members, coordinated by {coordinator}.",
                    { count: investments.members.length + 1, coordinator: investments.coordinator }
                  )}
                </p>
                <Link
                  href="/departments/investment"
                  className="group mt-3 inline-flex items-center gap-1 text-sm font-medium"
                >
                  <span className="link-underline">{t("fund.meetTeam", "Meet the team")}</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            )}
          </div>

          <Reveal className="lg:col-span-5">
            <dl className="overflow-hidden rounded-2xl border">
              <div className="bg-brand-navy px-5 py-3 text-xs font-semibold tracking-wide text-brand-cream uppercase">
                {t("fund.factsHeading", "Key facts")}
              </div>
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-6 border-t px-5 py-4 first-of-type:border-t-0">
                  <dt className="text-sm text-foreground/60">{fact.label}</dt>
                  <dd className="text-right font-medium">
                    {"href" in fact && fact.href ? (
                      <Link href={fact.href} className="link-underline">
                        {fact.value}
                      </Link>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <p className="mt-16 border-t pt-8 text-sm text-foreground/60">
          {t(
            "fund.disclaimer",
            "The {fundName} is a simulated, educational portfolio run by {shortName} members. Nothing on this page is investment advice.",
            { fundName: nfcFund.name, shortName: siteConfig.shortName }
          )}
        </p>
      </div>
    </div>
  );
}

function PerformanceSection({ performance }: { performance: FundPerformance }) {
  const t = useT();
  const { language } = useLanguage();
  const fundReturn = performance.returns.since_inception;
  const benchmark = performance.benchmark;
  const benchmarkReturn = benchmark?.since_inception ?? null;
  const difference = fundReturn != null && benchmarkReturn != null ? fundReturn - benchmarkReturn : null;
  const risk = performance.risk;
  const riskPending = risk != null && (risk.sharpe == null || risk.volatility == null);

  const metrics: { label: string; value: string; note?: boolean }[] = [
    { label: t("fund.stat.returns", "Returns"), value: formatPercent(fundReturn, language) },
    ...(benchmark
      ? [
          {
            label: t("fund.stat.vsBenchmark", "vs. {benchmark}", { benchmark: benchmark.name }),
            value: formatPoints(difference, language),
          },
        ]
      : []),
    { label: t("fund.stat.maxDrawdown", "Max drawdown"), value: formatPercent(performance.returns.max_drawdown, language) },
    ...(risk
      ? [
          {
            label: t("fund.stat.volatility", "Volatility (annualised)"),
            value: formatPercent(risk.volatility, language, { signed: false, digits: 1 }),
            note: risk.volatility == null,
          },
          {
            label: t("fund.stat.sharpe", "Sharpe ratio"),
            value:
              risk.sharpe == null
                ? "—"
                : new Intl.NumberFormat(language === "pt" ? "pt-PT" : "en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(risk.sharpe),
            note: risk.sharpe == null,
          },
        ]
      : []),
  ];

  return (
    <section aria-labelledby="fund-performance-heading">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id="fund-performance-heading" className="font-heading text-2xl font-bold tracking-normal">
            {t("fund.performanceHeading", "Performance")}
          </h2>
          <p className="text-sm text-foreground/60">
            {t("fund.performanceAsOf", "As of {asOf}", { asOf: formatDate(performance.as_of, language) })}
          </p>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <Reveal className="rounded-2xl border px-5 py-6 sm:px-8 lg:col-span-8">
          <h3 className="font-heading text-lg font-bold tracking-normal">
            {t("fund.chartHeading", "Cumulative return since inception")}
          </h3>
          <div className="mt-4">
            <FundPerformanceChart series={performance.series} benchmarkName={benchmark?.name ?? null} />
          </div>

          <details className="mt-2 text-sm">
            <summary className="cursor-pointer text-foreground/60 hover:text-foreground">
              {t("fund.allocation.toggle", "View allocation by sector and region")}
            </summary>
            <div className="mt-5 grid gap-8 sm:grid-cols-2">
              <AllocationBars heading={t("fund.allocation.sector", "By sector")} kind="sector" rows={performance.allocation.sector} />
              <AllocationBars heading={t("fund.allocation.region", "By region")} kind="region" rows={performance.allocation.geography} />
            </div>
          </details>
        </Reveal>

        <Reveal className="lg:col-span-4">
          <dl className="overflow-hidden rounded-2xl border">
            <div className="bg-brand-navy px-5 py-5 text-brand-cream">
              <dt className="text-xs font-semibold tracking-wide text-brand-cream/70 uppercase">
                {t("fund.stat.nav", "Net asset value")}
              </dt>
              <dd className="mt-1.5 font-heading text-4xl font-bold tabular-nums">
                {formatMoney(performance.nav, language, performance.currency)}
              </dd>
              {performance.inception_nav != null && (
                <dd className="mt-1 text-sm text-brand-cream/70">
                  {t("fund.stat.navFrom", "from {start} at inception", {
                    start: formatMoney(performance.inception_nav, language, performance.currency),
                  })}
                </dd>
              )}
            </div>
            {metrics.map((metric) => (
              <div key={metric.label} className="flex items-baseline justify-between gap-6 border-t px-5 py-3.5 first-of-type:border-t-0">
                <dt className="text-sm text-foreground/60">
                  {metric.label}
                  {metric.note && <sup aria-hidden="true">*</sup>}
                </dt>
                <dd className="text-right font-heading text-lg font-bold tabular-nums">{metric.value}</dd>
              </div>
            ))}
          </dl>
          {riskPending && risk && (
            <p className="mt-3 px-1 text-xs leading-relaxed text-foreground/60">
              {t(
                "fund.stat.riskPending",
                "* Shown once the fund has {days} trading days of history; annualising a few days of returns gives meaningless figures.",
                { days: risk.min_days }
              )}
            </p>
          )}
        </Reveal>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-foreground/60">
        {t(
          "fund.methodNote",
          "Time-weighted returns in euros, from the fund's own trade ledger and daily closing prices; the {benchmark} is also measured in euros, over the same dates.",
          { benchmark: benchmark?.name ?? nfcFund.benchmark }
        )}
        {risk?.risk_free_rate != null &&
          t("fund.sharpeNote", " Sharpe ratio against a {rate} risk-free rate.", {
            rate: formatPercent(risk.risk_free_rate, language, { signed: false, digits: 1 }),
          })}
      </p>
    </section>
  );
}

type Translate = ReturnType<typeof useT>;

/** Sector/region names come from the fund platform in English. */
function label(t: Translate, kind: "sector" | "region", value: string) {
  return t(`fund.${kind}.${value}`, value);
}

function AllocationBars({ heading, kind, rows }: { heading: string; kind: "sector" | "region"; rows: FundAllocation[] }) {
  const t = useT();
  const { language } = useLanguage();
  const largest = Math.max(...rows.map((row) => row.weight ?? 0), 0.0001);
  return (
    <div>
      <h3 className="font-heading text-lg font-bold tracking-normal">{heading}</h3>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-foreground/80">{label(t, kind, row.label)}</span>
              <span className="font-medium tabular-nums">
                {formatPercent(row.weight, language, { signed: false, digits: 1 })}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-foreground/[0.07]" aria-hidden="true">
              <div
                className="h-full rounded-full bg-foreground"
                style={{ width: `${((row.weight ?? 0) / largest) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
