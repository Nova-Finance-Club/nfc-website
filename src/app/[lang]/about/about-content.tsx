"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Link } from "@/components/locale-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem, TypewriterTitle } from "@/components/motion-primitives";
import { degreeNameKey } from "@/components/person-card";
import { aboutStory, departments, memberDegrees, siteConfig } from "@/lib/site-data";
import { useT } from "@/lib/language";
import { cn } from "@/lib/utils";

// All ten distinct degree names in memberDegrees, so this list always
// matches the "{distinctBackgrounds}" count the lead sentence quotes.
// English source strings — translated for display via degreeNameKey, same
// as PersonCard elsewhere on the site.
const backgroundPills = [
  "Applied Mathematics for Risk Management",
  "Actuarial Mathematics",
  "Computer Engineering",
  "Geological Engineering",
  "Industrial Engineering and Management",
  "Electrical and Computer Engineering",
  "Mathematics and Applications",
  "Biochemistry",
  "Big Data Analytics and Engineering",
  "Biomedical Engineering",
];

type Beat = {
  id: string;
  /** Big figure on the sticky side. */
  figure: string;
  /** Small caption under the figure. */
  caption: string;
  label: string;
  body: ReactNode;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Sticky-scroll story. From lg up, the left column stays pinned while the
 * beats scroll past on the right; whichever beat sits in the middle of the
 * screen drives the big figure on the left, which swaps with a short
 * vertical slide. Below lg (and without JavaScript) every beat simply shows
 * its own figure inline, stacked — nothing is hidden behind the effect.
 */
function StickyStory({ beats }: { beats: Beat[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // A thin band across the middle of the viewport: the beat crossing it
    // is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = refs.current.indexOf(entry.target as HTMLDivElement);
            if (index >= 0) setActive(index);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = beats[active];

  return (
    <div className="mx-auto grid max-w-7xl gap-x-16 px-6 lg:grid-cols-12">
      {/* Pinned figure (lg+) */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(50vh-9rem)] flex h-72 flex-col justify-center">
          <div className="mb-6 flex gap-2" aria-hidden="true">
            {beats.map((beat, i) => (
              <span
                key={beat.id}
                className={cn(
                  "h-1 rounded-full bg-brand-navy transition-all duration-500",
                  i === active ? "w-10 opacity-100" : "w-4 opacity-20"
                )}
              />
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <p className="font-heading text-8xl leading-none font-bold tracking-normal text-brand-navy xl:text-9xl">
                {current.figure}
              </p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground/70">
                {current.caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scrolling beats */}
      <div className="lg:col-span-7">
        {beats.map((beat, i) => (
          <div
            key={beat.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn(
              "border-t py-12 first:border-t-0 lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0",
              "transition-opacity duration-500 lg:opacity-30",
              i === active && "lg:opacity-100"
            )}
          >
            {/* Inline figure below lg */}
            <div className="mb-5 lg:hidden">
              <p className="font-heading text-6xl leading-none font-bold tracking-normal text-brand-navy">
                {beat.figure}
              </p>
              <p className="mt-2 max-w-sm text-sm text-foreground/70">{beat.caption}</p>
            </div>
            <h2 className="font-heading text-sm font-bold tracking-wide text-foreground/60 uppercase">
              {beat.label}
            </h2>
            <div className="mt-3 max-w-xl font-heading text-xl leading-relaxed sm:text-2xl">
              {beat.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutContent() {
  const t = useT();
  const distinctBackgrounds = new Set(
    Object.values(memberDegrees).map((degree) => degree.name)
  ).size;

  const beats: Beat[] = [
    {
      id: "gap",
      figure: t("about.gapStatNumber", aboutStory.gapStatNumber),
      caption: t("about.gapStatCaption", aboutStory.gapStatCaption),
      label: t("about.gapHeading", "The gap"),
      body: <p>{t("about.gapBody", aboutStory.gapBody)}</p>,
    },
    {
      id: "mission",
      figure: `<${siteConfig.shortName}>`,
      caption: t("home.slogan", siteConfig.slogan),
      label: t("about.missionHeading", aboutStory.missionHeading),
      body: <p>{t("about.aboutMission", aboutStory.aboutMission)}</p>,
    },
    {
      id: "members",
      figure: String(distinctBackgrounds),
      caption: t("about.membersCaption", "degree programmes represented among our {memberCount} members.", {
        memberCount: siteConfig.memberCount,
      }),
      label: t("about.membersHeading", aboutStory.membersHeading),
      body: (
        <>
          <p>
            {t("about.aboutMembersLead", aboutStory.aboutMembersLead, {
              memberCount: siteConfig.memberCount,
              distinctBackgrounds,
            })}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {backgroundPills.map((degree) => (
              <Badge key={degree} variant="outline" className="font-sans">
                {t(degreeNameKey(degree), degree)}
              </Badge>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "background",
      figure: String(departments.length),
      caption: t("about.departmentsCaption", "departments, run by an elected Board and General Council."),
      label: t("about.backgroundHeading", aboutStory.backgroundHeading),
      body: <p>{t("about.aboutBackground", aboutStory.aboutBackground)}</p>,
    },
  ];

  return (
    <div>
      {/* Hero — full-bleed navy band, same treatment as the homepage hero,
          so the About page opens with the same weight. No asset: the
          message is the design. */}
      <section className="bg-brand-navy py-16 text-brand-cream sm:py-20">
        <Reveal className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="mx-auto max-w-4xl font-heading text-4xl leading-[1.1] font-bold tracking-normal min-[400px]:text-5xl sm:text-6xl">
            <TypewriterTitle text={t("about.hero.headline", aboutStory.heroHeadline)} />
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-brand-cream/80">
            {t("about.hero.subtext", aboutStory.heroSubtext)}
          </p>
        </Reveal>
      </section>

      {/* The story — the gap, the mission, who the members are, and how the
          club is organised, told as a sticky scroll. See the gapStatCaption
          note in site-data.ts: the "2nd" figure is user-supplied, not
          independently verified. */}
      <section className="py-8 lg:py-0">
        <StickyStory beats={beats} />
      </section>

      {/* The community — centered lead statement, then the two-way exchange
          it describes shown directly underneath as two reciprocal blocks. */}
      <section className="border-t bg-brand-cream/40 py-16 text-center">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/80">
              {t("about.communityLead", aboutStory.communityLead)}
            </p>
          </Reveal>

          <StaggerGroup className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            <StaggerItem>
              <div className="h-full rounded-lg border bg-background p-6 text-center">
                <p className="font-heading text-xl leading-snug font-bold tracking-normal">
                  {t("about.communityExperienced", aboutStory.communityExperienced)}
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="h-full rounded-lg border bg-background p-6 text-center">
                <p className="font-heading text-xl leading-snug font-bold tracking-normal">
                  {t("about.communityNewcomers", aboutStory.communityNewcomers)}
                </p>
              </div>
            </StaggerItem>
          </StaggerGroup>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Button variant="outline" nativeButton={false} render={<Link href="/departments" />} className="group">
              {t("about.seeDepartments", "See our departments")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button nativeButton={false} render={<Link href="/join" />} className="group">
              {t("about.joinButton", "Join {shortName}", { shortName: siteConfig.shortName })}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
