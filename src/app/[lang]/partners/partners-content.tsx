"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
            // So dragging the strip with the mouse doesn't drag the image.
            draggable={false}
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

/** Auto-scroll speed, in pixels per second. */
const MARQUEE_SPEED = 35;

/**
 * The collaborations as a slow, endless strip that visitors can also move
 * themselves. It's a real horizontal scroller (scrollbar hidden) whose
 * position is advanced on every animation frame, rather than a CSS
 * transform, so it can be scrolled by hand: drag with the mouse, swipe on
 * touch, trackpad / Shift + wheel, or arrow keys once focused. Auto-scroll
 * then carries on from wherever it was left.
 *
 * The list is rendered three times; the scroll position is kept within the
 * middle copy, jumping by exactly one copy width at the edges, so the loop
 * is seamless in both directions.
 *
 * Pausing: with a mouse it stops while hovered; on touch a tap stops it and
 * the next tap restarts it; it also stops while being dragged, touched or
 * focused. It runs regardless of prefers-reduced-motion (the club asked
 * for it to always move); it's slow and stops as soon as it's interacted
 * with.
 */
function CollaborationsMarquee({ items }: { items: Collaboration[] }) {
  const t = useT();
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Plain refs, not state: these change constantly and the frame loop only
  // needs to read them; nothing re-renders.
  const holds = useRef({ tapped: false, hover: false, focus: false, touching: false, dragging: false });
  const drag = useRef({ x: 0, scroll: 0 });
  const wrapRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = scrollerRef.current;
    const track = el?.firstElementChild as HTMLElement | null;
    if (!el || !track) return;

    let copy = track.scrollWidth / 3;
    let pos = copy;
    el.scrollLeft = pos;

    // Keep the position inside the middle copy. Any shift is mirrored into
    // an in-progress mouse drag so it doesn't jump under the cursor.
    const wrap = () => {
      let shift = 0;
      if (el.scrollLeft < copy * 0.5) shift = copy;
      else if (el.scrollLeft > copy * 1.5) shift = -copy;
      if (shift) {
        el.scrollLeft += shift;
        drag.current.scroll += shift;
      }
      pos = el.scrollLeft;
    };
    wrapRef.current = wrap;

    const onScroll = () => {
      // Our own writes land within a pixel of `pos`; anything further is
      // the visitor scrolling, so adopt their position.
      if (Math.abs(el.scrollLeft - pos) > 2) {
        pos = el.scrollLeft;
        if (!holds.current.touching) wrap();
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    const resize = new ResizeObserver(() => {
      const offset = (pos - copy) / copy;
      copy = track.scrollWidth / 3;
      pos = copy + offset * copy;
      el.scrollLeft = pos;
    });
    resize.observe(track);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Cap the step so returning to a background tab doesn't leap ahead.
      const dt = Math.min(now - last, 64);
      last = now;
      const h = holds.current;
      if (!(h.tapped || h.hover || h.focus || h.touching || h.dragging)) {
        pos += (MARQUEE_SPEED * dt) / 1000;
        if (pos > copy * 1.5) pos -= copy;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      role="region"
      aria-label={t("partners.workedWithHeading", "Who we've worked with")}
      tabIndex={0}
      className="mt-10 cursor-grab overflow-x-auto overscroll-x-contain outline-none select-none [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") holds.current.hover = true;
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") holds.current.hover = false;
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        holds.current.dragging = true;
        drag.current = { x: e.clientX, scroll: e.currentTarget.scrollLeft };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!holds.current.dragging) return;
        e.currentTarget.scrollLeft = drag.current.scroll - (e.clientX - drag.current.x);
      }}
      onPointerUp={() => {
        holds.current.dragging = false;
      }}
      onPointerCancel={() => {
        holds.current.dragging = false;
      }}
      onTouchStart={() => {
        holds.current.touching = true;
      }}
      onTouchEnd={() => {
        holds.current.touching = false;
        wrapRef.current();
      }}
      // Tap to stop / tap again to restart, on touch only (a mouse stops it
      // by hovering). A swipe doesn't fire click, so scrolling won't toggle.
      onClick={(e) => {
        const type = (e.nativeEvent as PointerEvent).pointerType;
        const touch = type ? type !== "mouse" : window.matchMedia("(hover: none)").matches;
        if (touch) holds.current.tapped = !holds.current.tapped;
      }}
      // Only keyboard focus holds it: a mouse click or a tap also focuses
      // the strip, and that must not keep it stopped afterwards.
      onFocus={(e) => {
        holds.current.focus = e.currentTarget.matches(":focus-visible");
      }}
      onBlur={() => {
        holds.current.focus = false;
      }}
    >
      <ul className="flex w-max py-1">
        {[...items, ...items, ...items].map((item, i) => (
          <li
            key={`${item.key}-${i}`}
            // Copies 2 and 3 only exist for the seamless loop.
            aria-hidden={i >= items.length ? true : undefined}
            className="mr-4 w-64 shrink-0 sm:w-72"
          >
            <CollaborationCard item={item} />
          </li>
        ))}
      </ul>
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
