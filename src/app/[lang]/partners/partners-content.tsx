"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowRight, Megaphone, Mic, Pause, Play, Target, Users } from "lucide-react";

import { Link } from "@/components/locale-link";
import { BracketWordmark } from "@/components/bracket-wordmark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { PageHeader } from "@/components/page-header";
import { degreeNameKey } from "@/components/person-card";
import { memberDegrees, siteConfig } from "@/lib/site-data";
import { useT } from "@/lib/language";
import { cn } from "@/lib/utils";

// A "work with us" page: the organisations NFC has already worked with,
// the formats on offer, the audience it reaches, and a way to get in touch.

// Past collaborations, most recent first (dates kept here for ordering,
// not shown on the page). Each entry says what was actually done, so it
// reads as a track record rather than a logo wall implying formal
// partnerships. Logos live in public/partners/ (trimmed, transparent PNGs);
// width/height are the files' pixel sizes. An entry without a logo shows
// its name in the logo row instead.
type Collaboration = {
  key: string;
  name: string;
  logo?: { src: string; width: number; height: number };
  what: string;
};

const workedWith: Collaboration[] = [
  {
    // October 2026
    key: "junctionx",
    name: "JunctionX Lisbon",
    logo: { src: "/partners/junctionx.png", width: 1265, height: 240 },
    what: "Academic Partner of JunctionX Lisbon, Portugal’s largest student hackathon.",
  },
  {
    // September 2026
    key: "siemens",
    name: "Siemens",
    logo: { src: "/partners/siemens.png", width: 1505, height: 240 },
    what: "Academic Partner of the Siemens Tech Day.",
  },
  {
    // March 2026
    key: "bnp-paribas",
    name: "BNP Paribas",
    logo: { src: "/partners/bnp-paribas.png", width: 1086, height: 240 },
    what: "We took part in the 2nd edition of the Five Squared Challenge, organised by BNP Paribas Global Markets Portugal, and visited the Global Markets Portugal office.",
  },
  {
    // Date not recorded yet.
    key: "magentakoncept",
    name: "Magentakoncept",
    logo: { src: "/partners/magentakoncept.png", width: 450, height: 190 },
    what: "Worked with us on TRADATHON, our internal algorithmic cryptocurrency trading competition.",
  },
  {
    // May 2025
    key: "doutor-financas",
    name: "Doutor Finanças",
    logo: { src: "/partners/doutor-financas.png", width: 1486, height: 240 },
    what: "Workshop “Investing Successfully: First Steps”.",
  },
];

function CollaborationCard({ item }: { item: Collaboration }) {
  const t = useT();
  const { key, name, logo, what } = item;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      {/* Logo on its own tinted panel, centred and size-capped, so square
          emblems and long wordmarks carry similar visual weight. */}
      <div className="flex h-32 items-center justify-center bg-brand-cream/35 px-8">
        {logo ? (
          <Image
            src={logo.src}
            alt=""
            width={logo.width}
            height={logo.height}
            className="h-auto max-h-16 w-auto max-w-52 object-contain"
            // Already small, trimmed PNGs: serve them as-is so wide
            // wordmarks stay sharp on 2x screens.
            unoptimized
          />
        ) : (
          <span aria-hidden="true" className="font-heading text-2xl font-bold tracking-normal">
            {name}
          </span>
        )}
      </div>
      <div className="flex-1 p-5">
        <h3 className="font-heading text-lg font-bold tracking-normal">{name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">{t(`partners.worked.${key}`, what)}</p>
      </div>
    </div>
  );
}

/**
 * The collaborations as a slow, endless horizontal strip: the list is
 * rendered twice and the track slides by exactly one copy (-50%), so the
 * loop is seamless. With a mouse it pauses while hovered; on touch screens
 * (no hover) a tap on the strip pauses it and the next tap resumes it.
 * Keyboard focus also pauses it, and there's a pause button for anyone
 * who can't hover or tap (auto-moving content needs one).
 *
 * Reduced motion is handled in CSS only (the motion-reduce: classes, plus
 * the rule in globals.css), not with a JS branch: the server can't know
 * the visitor's setting, so a JS switch caused a hydration mismatch. Under
 * reduced motion the same markup becomes a static, centred, wrapping row
 * (3 + 2 on desktop), the duplicate copy and the pause button are hidden.
 */
function CollaborationsMarquee({ items }: { items: Collaboration[] }) {
  const t = useT();
  const [paused, setPaused] = useState(false);

  return (
    <div className="mt-10">
      <div
        className="partners-marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-visible motion-reduce:[mask-image:none]"
        data-paused={paused ? "" : undefined}
        style={{ "--marquee-duration": `${items.length * 9}s` } as CSSProperties}
        // Tap to pause / tap again to resume, on touch only: a mouse already
        // pauses it by hovering, so clicks from a mouse are ignored. A swipe
        // to scroll the page doesn't fire click, so it won't toggle.
        onClick={(e) => {
          const type = (e.nativeEvent as PointerEvent).pointerType;
          const touch = type ? type !== "mouse" : window.matchMedia("(hover: none)").matches;
          if (touch) setPaused((p) => !p);
        }}
      >
        <ul className="partners-marquee-track flex w-max motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-4">
          {[...items, ...items].map((item, i) => {
            const copy = i >= items.length;
            return (
              <li
                key={`${item.key}-${i}`}
                // Second copy only exists for the seamless loop.
                aria-hidden={copy ? true : undefined}
                className={cn(
                  "mr-4 w-64 shrink-0 sm:w-72",
                  "motion-reduce:mr-0 motion-reduce:w-full motion-reduce:sm:w-[calc((100%-1rem)/2)] motion-reduce:lg:w-[calc((100%-2rem)/3)]",
                  copy && "motion-reduce:hidden"
                )}
              >
                <CollaborationCard item={item} />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-4 flex justify-center motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={
            paused
              ? t("partners.marqueePlay", "Resume the carousel")
              : t("partners.marqueePause", "Pause the carousel")
          }
          className="inline-flex size-9 items-center justify-center rounded-full border text-foreground/70 transition-colors hover:border-brand-navy/40 hover:text-foreground active:scale-[0.96]"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      </div>
    </div>
  );
}

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
              "If your organisation wants to connect with our members or with {institution} students more broadly, these are the ways we work with partners.",
              { institution: t("institution.short", siteConfig.institution) }
            )}
          </p>
        </Reveal>

        {/* Who we've worked with */}
        <section className="mt-16 border-t pt-16">
          <Reveal className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-normal sm:text-4xl">
              {t("partners.workedWithHeading", "Who we've worked with")}
            </h2>
          </Reveal>
          <CollaborationsMarquee items={workedWith} />
        </section>

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
