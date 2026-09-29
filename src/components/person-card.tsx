"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

import { memberDegrees, memberLinkedIn, memberPhotoPosition, memberPhotos, siteConfig, type Person } from "@/lib/site-data";
import { useT } from "@/lib/language";
import { cn } from "@/lib/utils";
import { LinkedinIcon } from "@/components/social-icons";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// The role that leads a group gets a visibly bigger, highlighted card.
// Matching happens on these exact English strings — see PeopleGrid below —
// so translate the role for display only, never before this check runs.
export const LEAD_ROLES = ["Coordinator", "President"];

export function roleKey(role: string) {
  return `role.${role.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

// Also used by the About page's background-pills list, so both stay in
// sync with the same key for a given degree name.
export function degreeNameKey(name: string) {
  return `degree.name.${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function nameKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Full-bleed tile, no border/padding frame — the initials fill the space a
// real photo would occupy, so swapping in real photography later is a
// straight src swap, not a redesign. Name/role sit on a scrim at the
// bottom, same as a photo caption would. Sized compactly (see the fixed
// card widths in PeopleGrid) so the name reads as the focus, not the
// empty initials field.
export function PersonCard({
  person,
  featured = false,
  large = false,
}: {
  person: Person;
  featured?: boolean;
  /** Bigger name/role text without the featured/highlighted treatment —
   * for groups where nobody outranks anybody else. */
  large?: boolean;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const degree = memberDegrees[person.name];
  const photo = memberPhotos[person.name];
  const photoPosition = memberPhotoPosition[person.name];
  const linkedin = memberLinkedIn[person.name];
  // The plain "Coordinator" role (a department's own team page) is gendered
  // per that specific coordinator's name, since the string alone doesn't
  // carry which department it's on. Every other role translates generically.
  const displayRole =
    person.role === "Coordinator"
      ? t(`role.coordinator.by-name.${nameKey(person.name)}`, person.role)
      : t(roleKey(person.role), person.role);
  const mailtoHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    t("personCard.emailSubject", "Contact for {name}", { name: person.name })
  )}`;

  return (
    <div
      className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-xl bg-brand-navy shadow-sm transition-shadow duration-300 sm:cursor-default sm:hover:shadow-lg"
      onClick={() => setOpen((o) => !o)}
    >
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          quality={100}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:scale-[1.04] motion-reduce:transition-none"
          style={photoPosition ? { objectPosition: photoPosition } : undefined}
          // Next's `sizes` only ever describes the CSS box — it has no way
          // to know object-cover then crops ~47% of that fetched image's
          // width away (3:2 source into this 4:5 box keeps only
          // 0.8/1.5 ≈ 53% of the width). Naively sizing to the box width
          // meant the *visible* slice was being upscaled by ~1.9x after
          // crop, which reads as blur no quality bump can fix. Inflating
          // by 1/0.5333 ≈ 1.875x here requests enough source pixels that
          // the visible crop maps close to 1:1 after cropping.
          sizes={featured ? "(min-width: 640px) 600px, 540px" : "(min-width: 640px) 480px, 420px"}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span
            className={cn(
              "font-heading text-brand-cream/50 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:scale-110 motion-reduce:transition-none",
              featured ? "text-6xl" : large ? "text-5xl" : "text-4xl"
            )}
          >
            {initials(person.name)}
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent px-5 pt-14 pb-5">
        <p className={cn("font-heading font-bold text-white", featured ? "text-2xl" : large ? "text-xl" : "text-lg")}>
          {person.name}
        </p>
        <p className="text-base text-white/80">{displayRole}</p>

        {/* Degree and contact icons: revealed on hover from sm up (mouse
            available), or by tapping the card below that (no hover on
            touch, so a tap toggles `open` instead). */}
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out sm:[grid-template-rows:0fr] sm:group-hover:[grid-template-rows:1fr]",
            open ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"
          )}
        >
          <div
            className={cn(
              "overflow-hidden transition-opacity delay-75 duration-150 sm:opacity-0 sm:group-hover:opacity-100",
              open ? "opacity-100" : "opacity-0"
            )}
          >
            {degree && (
              <p className="mt-1 text-sm text-white/60">
                {t("personCard.degreeLine", "{level} in {name}", {
                  level: t(`degree.level.${degree.level.toLowerCase()}`, degree.level),
                  name: t(degreeNameKey(degree.name), degree.name),
                })}
              </p>
            )}
            <div className="mt-2.5 flex items-center gap-4">
              <a
                href={mailtoHref}
                aria-label={t("personCard.emailAriaLabel", "Email {name}", { name: person.name })}
                onClick={(e) => e.stopPropagation()}
                className="text-white/70 transition-colors hover:text-white"
              >
                <Mail className="size-5" />
              </a>
              {linkedin ? (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("personCard.linkedinAriaLabel", "{name} on LinkedIn", { name: person.name })}
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <LinkedinIcon className="size-5" />
                </a>
              ) : (
                <LinkedinIcon className="size-5 text-white/40" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Renders the group's lead (Coordinator/President) as a bigger, highlighted
// card above the rest of the group's people in a regular grid. Pass
// `hierarchy={false}` for groups where every role carries equal weight (e.g.
// governance bodies) — everyone gets an equally large card, nobody featured.
//
// Cards use a fixed width (not a percentage of the container), so a group
// of 3 doesn't blow up into oversized cards the way a percentage-based
// layout would — they stay the same compact size and simply wrap.
export function PeopleGrid({
  people,
  hierarchy = true,
}: {
  people: Person[];
  hierarchy?: boolean;
}) {
  if (!hierarchy) {
    return (
      <div className="flex flex-wrap justify-center gap-6">
        {people.map((person) => (
          <div key={person.name} className="w-56 sm:w-64">
            <PersonCard person={person} large />
          </div>
        ))}
      </div>
    );
  }

  const leadIndex = people.findIndex((p) => LEAD_ROLES.includes(p.role));
  const lead = leadIndex >= 0 ? people[leadIndex] : null;
  const rest = leadIndex >= 0 ? people.filter((_, i) => i !== leadIndex) : people;

  return (
    <div className="space-y-10">
      {lead && (
        <div className="flex justify-center">
          <div className="w-72 sm:w-80">
            <PersonCard person={lead} featured />
          </div>
        </div>
      )}
      {rest.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6">
          {rest.map((person) => (
            <div key={person.name} className="w-56 sm:w-64">
              <PersonCard person={person} large />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
