"use client";

import type { ReactNode } from "react";

import { Reveal } from "@/components/motion-primitives";

// Full-bleed dark-navy band for a page's own title (and, optionally, a
// short subtitle line), reused across the simpler interior pages (Alumni,
// Articles, Departments, Fund, Join) so the "here's what this page is"
// moment is consistent sitewide. Always centered. Home already has its
// own navy hero band; About's hero is a full sentence rather than a short
// title, so it's built inline rather than through this component.
export function PageHeader({
  title,
  subtitle,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section className="bg-brand-navy py-16 text-brand-cream sm:py-20">
      <Reveal className="mx-auto max-w-7xl px-6 text-center">
        {/* text-4xl on phones: "<Departamentos>_" at text-5xl was wider than
            a 375px screen and caused sideways scrolling. */}
        <h1 className="font-heading text-4xl font-bold tracking-normal [overflow-wrap:anywhere] min-[400px]:text-5xl sm:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <div className="mx-auto mt-4 max-w-2xl text-lg text-brand-cream/80">
            {subtitle}
          </div>
        )}
      </Reveal>
    </section>
  );
}
