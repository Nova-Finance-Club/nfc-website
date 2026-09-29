"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Link } from "@/components/locale-link";

import { PageHeader } from "@/components/page-header";
import { SharedElement } from "@/components/page-transition";
import { TypewriterTitle } from "@/components/motion-primitives";
import { departments, governanceUnits, siteConfig } from "@/lib/site-data";
import { useT } from "@/lib/language";

function UnitCard({
  slug,
  name,
  nameKey,
  badgeImage,
  summary,
  summaryKey,
  accent,
}: {
  accent: string;
  slug: string;
  name: string;
  nameKey?: string;
  badgeImage: string;
  summary: string;
  summaryKey: string;
}) {
  const t = useT();
  return (
    <Link
      href={`/departments/${slug}`}
      className="dept-card group flex items-start gap-4 rounded-lg border p-5"
      style={{ "--dept-accent": accent } as CSSProperties}
    >
      <SharedElement name={`dept-badge-${slug}`}>
        <Image
          src={badgeImage}
          alt=""
          width={40}
          height={40}
          className="mt-0.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:rotate-[-3deg] motion-reduce:transform-none"
        />
      </SharedElement>
      <div>
        <p className="dept-card-title inline font-medium">{nameKey ? t(nameKey, name) : name}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(summaryKey, summary, { shortName: siteConfig.shortName })}
        </p>
      </div>
    </Link>
  );
}

export function DepartmentsContent() {
  const t = useT();

  return (
    <div>
      <PageHeader
        title={<TypewriterTitle text={`<${t("departments.index.heading", "Departments")}>`} />}
        subtitle={t(
          "departments.index.subtitle",
          "{shortName}'s governance and its four functional departments.",
          { shortName: siteConfig.shortName }
        )}
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-3 sm:grid-cols-2">
          {governanceUnits.map((unit) => (
            <UnitCard
              key={unit.slug}
              slug={unit.slug}
              name={unit.name}
              nameKey={`gov.${unit.slug}.name`}
              badgeImage={unit.badgeImage}
              accent={unit.slug === "board" ? "#633176" : "#1b1c20"}
              summary={unit.summary}
              summaryKey={`gov.${unit.slug}.summary`}
            />
          ))}
        </div>

        <h2 className="mt-12 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {t("departments.index.deptListHeading", "Departments")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {departments.map((dept) => (
            <UnitCard
              key={dept.slug}
              slug={dept.slug}
              name={dept.name}
              nameKey={`dept.${dept.slug}.name`}
              badgeImage={dept.badgeImage}
              accent={dept.accent}
              summary={dept.summary}
              summaryKey={`dept.${dept.slug}.summary`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
