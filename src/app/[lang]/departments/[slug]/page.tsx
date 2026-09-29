import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageTransition } from "@/components/page-transition";
import { translate } from "@/lib/i18n";
import { langFrom, pageMetadata } from "@/lib/seo";
import { departments, governanceUnits, siteConfig } from "@/lib/site-data";
import { DetailContent } from "./detail-content";

type Props = PageProps<"/[lang]/departments/[slug]">;

function findUnit(slug: string) {
  const governance = governanceUnits.find((u) => u.slug === slug);
  if (governance) return { kind: "governance" as const, unit: governance };
  const department = departments.find((d) => d.slug === slug);
  if (department) return { kind: "department" as const, unit: department };
  return null;
}

export function generateStaticParams() {
  return [...governanceUnits, ...departments].map((u) => ({ slug: u.slug }));
}
export const dynamicParams = false;

// Matches the short form shown in the page's own <h1> and the unit
// switcher pills (see unitShortFallback in detail-content.tsx) — the tab
// title shouldn't repeat "Department" when the page itself doesn't.
function shortName(name: string) {
  return name.replace(/ Department$/, "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = langFrom(raw);
  const found = findUnit(slug);
  if (!found) return {};
  const titleKey = found.kind === "department" ? `dept.${slug}.short` : `gov.${slug}.name`;
  const descriptionKey = found.kind === "department" ? `dept.${slug}.summary` : `gov.${slug}.summary`;
  const title = translate(lang, titleKey, shortName(found.unit.name));
  return pageMetadata(lang, `/departments/${slug}`, {
    title,
    descriptionKey,
    description: found.unit.summary,
    vars: { shortName: siteConfig.shortName },
  });
}

export default async function DepartmentDetailPage({ params }: Props) {
  const { slug } = await params;
  const found = findUnit(slug);
  if (!found) notFound();

  return (
    <PageTransition>
      <DetailContent found={found} />
    </PageTransition>
  );
}
