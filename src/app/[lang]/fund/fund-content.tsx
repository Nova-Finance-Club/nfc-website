"use client";

import { ArrowRight } from "lucide-react";

import { Link } from "@/components/locale-link";
import { PageHeader } from "@/components/page-header";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { BracketWordmark } from "@/components/bracket-wordmark";
import { departments, nfcFund, siteConfig } from "@/lib/site-data";
import { useT } from "@/lib/language";

// Before the first quarter there is no performance to show, so the page
// describes the fund (mandate, method, reporting, team) rather than showing
// an empty chart and dashes. When the first NFC Performance Report is out,
// add the performance section back above "How it works".
const investments = departments.find((d) => d.slug === "investment");

export function FundContent() {
  const t = useT();

  const facts = [
    { label: t("fund.fact.type", "Type"), value: t("fund.fact.typeValue", "Simulated, educational portfolio") },
    { label: t("fund.fact.benchmark", "Benchmark"), value: nfcFund.benchmark },
    {
      label: t("fund.fact.managedBy", "Managed by"),
      value: t("dept.investment.name", "Investments Department"),
      href: "/departments/investment",
    },
    { label: t("fund.fact.reporting", "Reporting"), value: t("fund.fact.reportingValue", "Quarterly, on LinkedIn") },
    {
      label: t("fund.fact.start", "Start"),
      value: t("fund.fact.startValue", "{mandate} mandate", { mandate: siteConfig.mandate }),
    },
  ];

  return (
    <div>
      <PageHeader
        title={<BracketWordmark text={nfcFund.name} />}
        subtitle={t("fund.subtitle", "A simulated portfolio for real investment practice.")}
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
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
                    {fact.href ? (
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
