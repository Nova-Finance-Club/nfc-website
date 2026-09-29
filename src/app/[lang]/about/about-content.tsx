"use client";

import { Link } from "@/components/locale-link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem, TypewriterTitle } from "@/components/motion-primitives";
import { degreeNameKey } from "@/components/person-card";
import { aboutStory, memberDegrees, siteConfig } from "@/lib/site-data";
import { useT } from "@/lib/language";

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

export function AboutContent() {
  const t = useT();
  const distinctBackgrounds = new Set(
    Object.values(memberDegrees).map((degree) => degree.name)
  ).size;

  return (
    <div>
      {/* Hero — full-bleed navy band, same treatment as the homepage hero,
          so the About page opens with the same weight. No asset: the
          message is the design. */}
      <section className="bg-brand-navy py-16 text-brand-cream sm:py-20">
        <Reveal className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="mx-auto max-w-3xl font-heading text-5xl leading-[1.1] font-bold tracking-normal sm:text-6xl">
            <TypewriterTitle text={t("about.hero.headline", aboutStory.heroHeadline)} />
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-brand-cream/80">
            {t("about.hero.subtext", aboutStory.heroSubtext)}
          </p>
        </Reveal>
      </section>

      {/* The gap — the number on the left, the claim it backs on the
          right, same big-numeral treatment as the homepage's
          "NFC in numbers" tiles. See the gapStatCaption note in
          site-data.ts: this figure is user-supplied, not independently
          verified. */}
      <section className="border-y bg-brand-cream/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="font-heading text-7xl font-bold tracking-normal text-brand-navy sm:text-8xl">
                {t("about.gapStatNumber", aboutStory.gapStatNumber)}
              </p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                {t("about.gapStatCaption", aboutStory.gapStatCaption)}
              </p>
            </div>
            <p className="max-w-md font-heading text-xl leading-relaxed sm:text-2xl lg:col-span-7">
              {t("about.gapBody", aboutStory.gapBody)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission / Members / Background — one three-column panel. Each
          column gets the same small-caps label treatment so they read as
          peers, not three separate page moments stacked on top of each
          other. */}
      <section className="border-y py-16">
        <StaggerGroup className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3 md:gap-8">
          <StaggerItem>
            <h2 className="font-heading text-sm font-bold tracking-wide text-muted-foreground uppercase">
              {t("about.missionHeading", aboutStory.missionHeading)}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("about.aboutMission", aboutStory.aboutMission)}
            </p>
          </StaggerItem>

          <StaggerItem>
            <h2 className="font-heading text-sm font-bold tracking-wide text-muted-foreground uppercase">
              {t("about.membersHeading", aboutStory.membersHeading)}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("about.aboutMembersLead", aboutStory.aboutMembersLead, {
                memberCount: siteConfig.memberCount,
                distinctBackgrounds,
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {backgroundPills.map((degree) => (
                <Badge key={degree} variant="outline">
                  {t(degreeNameKey(degree), degree)}
                </Badge>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <h2 className="font-heading text-sm font-bold tracking-wide text-muted-foreground uppercase">
              {t("about.backgroundHeading", aboutStory.backgroundHeading)}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t("about.aboutBackground", aboutStory.aboutBackground)}
            </p>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* The community — centered lead statement, then the two-way exchange
          it describes shown directly underneath as two reciprocal blocks,
          so the cards read as illustrating that sentence, not as an
          unrelated column next to it. Two, not three: the text names
          exactly two directions this goes. The other deliberately
          centered moment on the page. */}
      <section className="bg-brand-cream/40 py-16 text-center">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
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
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="/departments" />}
            className="group h-10 min-w-52 px-4"
          >
            {t("about.seeDepartments", "See our departments")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button size="lg" nativeButton={false} render={<Link href="/join" />} className="group h-10 min-w-52 px-4">
            {t("about.joinButton", "Join {shortName}", { shortName: siteConfig.shortName })}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
