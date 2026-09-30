"use client";

import { ArrowRight, Megaphone, Mic, Target, Users } from "lucide-react";

import { Link } from "@/components/locale-link";
import { BracketWordmark } from "@/components/bracket-wordmark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { PageHeader } from "@/components/page-header";
import { degreeNameKey } from "@/components/person-card";
import { memberDegrees, siteConfig } from "@/lib/site-data";
import { useT } from "@/lib/language";

// A "work with us" page, not a partners wall: NFC has no partners to list
// yet, and a club site shouldn't fake one. It states the formats on offer,
// the audience it reaches, and a way to get in touch. Once there are
// partners, add their logos above the formats.
const formats = [
  {
    key: "talent",
    Icon: Users,
    title: "Access to talent",
    body: "Share internships, graduate programmes and job openings with our members, and meet them in person.",
  },
  {
    key: "events",
    Icon: Mic,
    title: "Co-organised events",
    body: "Workshops, talks and masterclasses at NOVA FCT, planned and promoted together with our Events & External Relations team.",
  },
  {
    key: "visibility",
    Icon: Megaphone,
    title: "Visibility",
    body: "Your brand on NFC's social channels, events and website, alongside the work our members publish.",
  },
  {
    key: "challenges",
    Icon: Target,
    title: "Case studies & challenges",
    body: "Practical challenges for our members, from case studies to trading competitions, built around a problem your team knows well.",
  },
];

export function PartnersContent() {
  const t = useT();
  const degrees = Array.from(new Set(Object.values(memberDegrees).map((d) => d.name)));

  return (
    <div>
      <PageHeader
        title={<BracketWordmark text={t("partners.heading", "Partner with us")} />}
        subtitle={t(
          "partners.subtitle",
          "Work with the finance club of NOVA School of Science and Technology."
        )}
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-xl leading-relaxed sm:text-2xl">
            {t(
              "partners.intro",
              "{shortName} brings together {memberCount} students from {degreeCount} degree programmes at {institution}, most of them in mathematics, engineering and data, and through our events and channels we reach the wider {institution} community. If your organisation wants to connect with our members or with {institution} students more broadly, these are the ways we work with partners.",
              {
                shortName: siteConfig.shortName,
                memberCount: siteConfig.memberCount,
                degreeCount: degrees.length,
                institution: t("institution.short", siteConfig.institution),
              }
            )}
          </p>
        </Reveal>

        {/* Formats */}
        <section className="mt-16 border-t pt-16">
          <Reveal className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-normal sm:text-4xl">
              {t("partners.formatsHeading", "How we can work together")}
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2">
            {formats.map(({ key, Icon, title, body }) => (
              <StaggerItem key={key}>
                <div className="group h-full rounded-xl border p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-navy/30 hover:shadow-md motion-reduce:hover:translate-y-0">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-navy text-brand-cream transition-transform duration-500 group-hover:rotate-[-6deg] motion-reduce:transform-none">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-bold tracking-normal">
                    {t(`partners.format.${key}.title`, title)}
                  </h3>
                  <p className="mt-2 leading-relaxed text-foreground/80">
                    {t(`partners.format.${key}.body`, body)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        {/* Audience */}
        <section className="mt-16 border-t pt-16 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold tracking-normal sm:text-4xl">
              {t("partners.audienceHeading", "Who you'd reach")}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-foreground/70">
              {t("partners.audienceSubtitle", "Our current members' degree programmes, bachelor's and master's.")}
            </p>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
              {degrees.map((degree) => (
                <Badge key={degree} variant="outline" className="px-3 py-1 text-sm">
                  {t(degreeNameKey(degree), degree)}
                </Badge>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Contact */}
        <section className="mt-16 border-t pt-16">
          <Reveal className="flex flex-wrap justify-center gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/#contact" />} className="group h-10 min-w-40 px-4">
              {t("partners.contactHeading", "Let's talk")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/departments/events-external-relations" />}
              className="group h-10 min-w-40 px-4"
            >
              {t("partners.meetTeam", "Meet the team")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
