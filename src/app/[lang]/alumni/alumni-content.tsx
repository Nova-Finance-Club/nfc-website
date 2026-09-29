"use client";

import { useState } from "react";

import { Reveal, StaggerGroup, StaggerItem, TypewriterTitle } from "@/components/motion-primitives";
import { PageHeader } from "@/components/page-header";
import { roleKey } from "@/components/person-card";
import { alumniTerms, siteConfig, type Person } from "@/lib/site-data";
import { useT } from "@/lib/language";
import { cn } from "@/lib/utils";

function PersonList({ people }: { people: Person[] }) {
  const t = useT();
  return (
    <ul className="mt-4 divide-y border-t">
      {people.map((person) => (
        <li
          key={person.name}
          className="flex items-baseline justify-between gap-4 py-3"
        >
          <span className="font-medium">{person.name}</span>
          <span className="text-sm text-muted-foreground">
            {t(roleKey(person.role), person.role)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function groupTitleKey(title: string) {
  return `alumni.group.${title.toLowerCase().replace(/\s+/g, "-")}`;
}

function subgroupTitleKey(title: string) {
  return `subgroup.${title.toLowerCase().replace(/\s+/g, "-")}`;
}

function termLabel(t: ReturnType<typeof useT>, term: (typeof alumniTerms)[number]) {
  return `${t(`alumni.season.${term.season.toLowerCase()}`, term.season)} ${term.year}`;
}

export function AlumniContent() {
  const t = useT();
  // alumniTerms is newest first, so the first entry is "the last elected"
  // — the default tab.
  const [selectedSlug, setSelectedSlug] = useState(alumniTerms[0].slug);
  const term = alumniTerms.find((candidate) => candidate.slug === selectedSlug) ?? alumniTerms[0];

  const inaugurated = term.inauguratedDisplay
    ? t(`alumni.term.${term.slug}.inaugurated`, term.inauguratedDisplay)
    : null;
  const location = term.location
    ? t("alumni.location", term.location, {
        institutionFullName: t("institution.full", siteConfig.institutionFullName),
      })
    : null;

  return (
    <div>
      <PageHeader
        title={<TypewriterTitle text={`<${t("alumni.heading", "Alumni")}>`} />}
        subtitle={t(
          "alumni.subtitle",
          "{shortName}'s past elected leadership, mandate by mandate.",
          { shortName: siteConfig.shortName }
        )}
      />

      {/* Semester switcher — same pill treatment as the department
          switcher on /departments/[slug]: a full-width strip right under
          the header, newest (the default) first. */}
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4">
          {alumniTerms.map((candidate) => (
            <button
              key={candidate.slug}
              type="button"
              onClick={() => setSelectedSlug(candidate.slug)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                candidate.slug === selectedSlug
                  ? "border-brand-navy bg-brand-navy text-brand-cream"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {termLabel(t, candidate)}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <section>
          <Reveal>
            <h2 className="font-heading text-2xl font-bold tracking-normal sm:text-3xl">
              {termLabel(t, term)}
            </h2>
            {inaugurated && (
              <p className="mt-1 text-sm text-muted-foreground">
                {t("alumni.swornIn", "Sworn in on")} {inaugurated}
                {location ? ` ${t("alumni.swornInAt", "at")} ${location}` : ""}.
              </p>
            )}
          </Reveal>

          <StaggerGroup className="mt-8 space-y-14">
            {term.groups.map((group) => (
              <StaggerItem key={group.title}>
                <h3 className="font-heading text-lg font-bold tracking-normal">
                  {t(groupTitleKey(group.title), group.title)}
                </h3>

                {group.people && <PersonList people={group.people} />}

                {group.subgroups && (
                  <div className="mt-4 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                    {group.subgroups.map((subgroup) => (
                      <div key={subgroup.title}>
                        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                          {t(subgroupTitleKey(subgroup.title), subgroup.title)}
                        </h4>
                        <PersonList people={subgroup.people} />
                      </div>
                    ))}
                  </div>
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      </div>
    </div>
  );
}
