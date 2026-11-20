"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion-primitives";

// Full-bleed dark-navy band for a page's own title (and, optionally, a
// short subtitle line), reused across the simpler interior pages (Alumni,
// Articles, Departments, Fund, Join, Partners) so the "here's what this
// page is" moment is consistent sitewide. Always centered.
//
// The home hero's bridge sits behind it, under a heavier navy veil than on
// the home page: the band is short and the title is centred over the
// middle of the image, so the bridge stays a texture, not the subject.
export function PageHeader({
  title,
  subtitle,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy py-16 text-brand-cream sm:py-20">
      <PageHeaderBridge />
      <Reveal className="relative mx-auto max-w-7xl px-6 text-center">
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

/** The bridge panorama and its navy veil, behind a navy header band. */
export function PageHeaderBridge() {
  return (
    <>
      {/* On a wide, short band object-cover scales the panorama to the
          band's width and crops top and bottom; 70% down keeps the deck and
          the main tower in view rather than empty sky.

          On phones the band is narrow, and scaling the panorama to its
          height would squeeze most of the bridge into a small, busy frame.
          Instead the image box is 2.6× the screen's width, pinned to the
          right edge: the phone sees a close-up of the far (right-hand)
          tower with the deck running towards it. */}
      <div className="absolute inset-y-0 right-0 -z-10 w-[260%] sm:inset-x-0 sm:w-auto">
        <Image
          src="/brand/hero-bridge.webp"
          alt=""
          fill
          priority
          quality={90}
          sizes="(max-width: 639px) 260vw, 100vw"
          className="object-cover object-[50%_70%]"
        />
      </div>
      {/* Lighter veil on phones: the right of the photo is already dark,
          and at 70% the close-up of the tower disappeared. */}
      <div className="absolute inset-0 -z-10 bg-brand-navy/45 sm:bg-brand-navy/70" />
    </>
  );
}
