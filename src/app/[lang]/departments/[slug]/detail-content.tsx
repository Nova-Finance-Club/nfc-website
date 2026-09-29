"use client";

import Image from "next/image";
import { Link } from "@/components/locale-link";
import { BracketWordmark } from "@/components/bracket-wordmark";
import type { ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PeopleGrid } from "@/components/person-card";
import { Reveal } from "@/components/motion-primitives";
import { SharedElement } from "@/components/page-transition";
import { GithubIcon } from "@/components/social-icons";
import { SHOW_DEPARTMENT_PHOTOS, departments, governanceUnits, siteConfig, type Person } from "@/lib/site-data";
import { useT } from "@/lib/language";
import { cn } from "@/lib/utils";

type GovernanceUnit = (typeof governanceUnits)[number];
type Department = (typeof departments)[number];
type Found =
  | { kind: "governance"; unit: GovernanceUnit }
  | { kind: "department"; unit: Department };

const allUnits = [...governanceUnits, ...departments];

function subgroupTitleKey(title: string) {
  return `subgroup.${title.toLowerCase().replace(/\s+/g, "-")}`;
}

// The full unit.name carries a "Department" suffix for departments (e.g.
// "Investments Department") — fine as a category label, but redundant once
// it's the thing the switcher pill or page title is already about. Both use
// the short form instead; governance units (Board, General Council) never
// had the suffix, so their short form is just their name.
function unitShortKey(unit: (typeof allUnits)[number]) {
  return "coordinator" in unit ? `dept.${unit.slug}.short` : `gov.${unit.slug}.name`;
}

function unitShortFallback(unit: (typeof allUnits)[number]) {
  return unit.name.replace(/ Department$/, "");
}

// Total people shown on a unit's own team section — its direct roster plus
// anyone listed under a subgroup (e.g. the Board's department coordinators,
// or the General Council's two constituent bodies).
function unitMemberCount(unit: { people?: Person[]; subgroups?: { people: Person[] }[] }) {
  const direct = unit.people?.length ?? 0;
  const nested = unit.subgroups?.reduce((sum, group) => sum + group.people.length, 0) ?? 0;
  return direct + nested;
}

function BackLink() {
  const t = useT();
  return (
    <Link
      href="/departments"
      className="group inline-flex items-center gap-1 text-sm text-brand-cream/70 hover:text-brand-cream"
    >
      <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />{" "}
      {t("departmentsSlug.back", "Departments")}
    </Link>
  );
}

// Quick-switch pill row right under the hero, so a visitor can jump
// straight to another department or governance unit without going back
// through the index first.
function UnitSwitcher({ currentSlug }: { currentSlug: string }) {
  const t = useT();
  return (
    <div className="border-b bg-background">
      {/* justify-start on phones: a centred row that overflows would cut
          off its first pills, out of reach of horizontal scrolling. */}
      <div className="mx-auto flex max-w-7xl justify-start gap-2 overflow-x-auto px-6 py-4 lg:justify-center">
        {allUnits.map((unit) => (
          <Link
            key={unit.slug}
            href={`/departments/${unit.slug}`}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
              unit.slug === currentSlug
                ? "border-brand-navy bg-brand-navy text-brand-cream"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {t(unitShortKey(unit), unitShortFallback(unit))}
          </Link>
        ))}
      </div>
    </div>
  );
}

function TeamHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-center font-heading text-2xl font-bold tracking-normal">
      {children}
    </h2>
  );
}

// Team/cohort photo, beside the name and description in the hero. Only
// rendered when there is a photo to show — no empty placeholder. Fixed 3:2
// ratio, matching the 6000x4000 photos members actually upload. Capped at
// max-w-lg so a half-width photo doesn't make the hero tall and empty.
function HeroPhoto({ photo }: { photo: string }) {
  return (
    <div className="relative aspect-[3/2] w-full max-w-lg overflow-hidden rounded-2xl sm:justify-self-end">
      <Image src={photo} alt="" fill quality={100} className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
    </div>
  );
}

export function DetailContent({ found }: { found: Found }) {
  const t = useT();

  if (found.kind === "governance") {
    const unit = found.unit;
    return (
      <div>
        <section className="bg-brand-navy py-10 text-brand-cream sm:py-12">
          <div className="mx-auto max-w-7xl px-6">
            {/* Back link inside the text column, so it stays next to the
                eyebrow instead of floating above a vertically centred block. */}
            <Reveal className={cn("grid gap-8", unit.photo && "sm:grid-cols-2 sm:items-center")}>
              <div className={cn(!unit.photo && "max-w-4xl")}>
                <BackLink />
                <div className="mt-5 flex items-center gap-3">
                  <SharedElement name={`dept-badge-${unit.slug}`}>
                    <Image src={unit.badgeImage} alt="" width={40} height={40} />
                  </SharedElement>
                  <p className="text-xs font-semibold tracking-wide text-brand-cream/60 uppercase">
                    {t("departmentsSlug.eyebrowGovernance", "Governance · {count} members", {
                      count: unitMemberCount(unit),
                    })}
                  </p>
                </div>
                <h1 className="mt-3 font-heading text-4xl font-bold tracking-normal lg:text-5xl">
                  <BracketWordmark key={unit.slug} text={t(`gov.${unit.slug}.name`, unit.name)} />
                </h1>
                <p className="mt-4 max-w-3xl text-brand-cream/80">
                  {t(`gov.${unit.slug}.description`, unit.description ?? unit.summary, {
                    shortName: siteConfig.shortName,
                  })}
                </p>
                <div className="mt-6">
                  <Button
                    nativeButton={false}
                    render={<a href="#team" />}
                    className="bg-brand-cream text-brand-navy hover:bg-brand-cream/90"
                  >
                    {t("departmentsSlug.ourTeamButton", "Our team")}
                    <ArrowDown className="size-4" />
                  </Button>
                </div>
              </div>
              {unit.photo && <HeroPhoto photo={unit.photo} />}
            </Reveal>
          </div>
        </section>

        <UnitSwitcher currentSlug={unit.slug} />

        <div className="mx-auto max-w-7xl px-6 py-16">
          <div id="team" className="scroll-mt-24">
            <TeamHeading>{t("departmentsSlug.ourTeam", "Our Team")}</TeamHeading>

            {unit.people && (
              <Reveal className="mt-10">
                <PeopleGrid people={unit.people as Person[]} hierarchy={false} />
              </Reveal>
            )}

            {unit.subgroups?.map((group) => (
              <div key={group.title} className="mt-14">
                <h3 className="text-center text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {t(subgroupTitleKey(group.title), group.title)}
                </h3>
                <Reveal className="mt-6">
                  <PeopleGrid people={group.people as Person[]} hierarchy={false} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const dept = found.unit;
  const deptPhoto = SHOW_DEPARTMENT_PHOTOS ? dept.photo : undefined;
  const people: Person[] = [
    { role: "Coordinator", name: dept.coordinator },
    ...dept.members.map((name) => ({ role: "Member", name })),
  ];

  return (
    <div>
      <section className="bg-brand-navy py-10 text-brand-cream sm:py-12">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className={cn("grid gap-8", deptPhoto && "sm:grid-cols-2 sm:items-center")}>
            <div className={cn(!deptPhoto && "max-w-4xl")}>
              <BackLink />
              <div className="mt-5 flex items-center gap-3">
                <SharedElement name={`dept-badge-${dept.slug}`}>
                  <Image src={dept.badgeImage} alt="" width={40} height={40} />
                </SharedElement>
                <p className="text-xs font-semibold tracking-wide text-brand-cream/60 uppercase">
                  {t("departmentsSlug.eyebrowDepartment", "Department · {count} members", {
                    count: dept.members.length + 1,
                  })}
                </p>
              </div>
              <h1 className="mt-3 font-heading text-4xl font-bold tracking-normal lg:text-5xl">
                <BracketWordmark key={dept.slug} text={t(unitShortKey(dept), unitShortFallback(dept))} />
              </h1>
              <p className="mt-4 max-w-3xl leading-relaxed text-brand-cream/80">
                {t(`dept.${dept.slug}.description`, dept.description ?? dept.summary)}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  nativeButton={false}
                  render={<a href="#team" />}
                  className="group bg-brand-cream text-brand-navy hover:bg-brand-cream/90"
                >
                  {t("departmentsSlug.ourTeamButton", "Our team")}
                  <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
                </Button>
                {dept.repo && (
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={<a href={dept.repo} target="_blank" rel="noopener noreferrer" />}
                    className="group border-brand-cream/30 bg-transparent text-brand-cream hover:bg-brand-cream/10 hover:text-brand-cream"
                  >
                    <GithubIcon className="size-4" />
                    {t("departmentsSlug.codeOnGithub", "Code on GitHub")}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                )}
              </div>
            </div>
            {deptPhoto && <HeroPhoto photo={deptPhoto} />}
          </Reveal>
        </div>
      </section>

      <UnitSwitcher currentSlug={dept.slug} />

      <div className="mx-auto max-w-7xl px-6 py-16">
        {dept.divisions && (
          <>
            {/* Side-by-side from md up; stacked on mobile, but each division
                keeps its own bordered card so the split stays visible at
                any width. */}
            <Reveal
              className={cn(
                "grid gap-4 md:items-stretch",
                dept.divisions.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
              )}
            >
              {dept.divisions.map((division, i) => (
                <div
                  key={division.name}
                  className="h-full rounded-lg border border-t-2 p-5 transition-colors duration-300 hover:bg-brand-cream/30"
                  style={{ borderTopColor: dept.accent }}
                >
                  <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    {t(`dept.${dept.slug}.divisions.${i}.name`, division.name)}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {t(`dept.${dept.slug}.divisions.${i}.description`, division.description)}
                  </p>
                </div>
              ))}
            </Reveal>
            <div className="my-16 border-t" />
          </>
        )}

        <div id="team" className="scroll-mt-24">
          <TeamHeading>{t("departmentsSlug.ourTeam", "Our Team")}</TeamHeading>
          <Reveal className="mt-10">
            <PeopleGrid people={people} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
