"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { BellRing, ChevronDown } from "lucide-react";

import { Link } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem, TypewriterTitle } from "@/components/motion-primitives";
import { PageHeader } from "@/components/page-header";
import { departments, recruitment, siteConfig } from "@/lib/site-data";
import { useLanguage, useT } from "@/lib/language";

const departmentPitch: Record<string, { label: string; lookingFor: string[] }> = {
  investment: {
    label: "Investments",
    lookingFor: [
      "want to actively manage a real fund and see how your calls play out",
      "want to get better at reading markets and picking stocks",
      "want to understand how investment decisions actually get made",
    ],
  },
  "personal-finance": {
    label: "Personal Finance",
    lookingFor: [
      "like explaining things clearly and want to write for a real audience",
      "are curious about the economy and want to follow it more closely",
      "want your work to be seen by people outside the club",
    ],
  },
  "quantitative-trading": {
    label: "Quantitative Trading",
    lookingFor: [
      "want to learn quant finance from scratch, no background needed",
      "enjoy coding and want to use it on real finance problems",
      "want to end up with a project you can actually point to",
    ],
  },
  "events-external-relations": {
    label: "Events & External Relations",
    lookingFor: [
      "like organizing things and talking to people",
      "want to help bring partners, speakers and events to the club",
      "want experience that isn't just academic",
    ],
  },
};

const process = [
  "Submit your application form",
  "Short interview with the department(s) of your choice",
  "Results and onboarding session",
];

const faqs = [
  {
    q: "Do I need a background in finance?",
    a: "No. We look for genuine interest in finance, not prior experience. Quantitative Trading, for example, starts everyone from scratch with its Quant Crash Course.",
  },
  {
    q: "Which courses and years can apply?",
    a: "Any student at {institution}, from any course and any year: our members come from mathematics, engineering, computer science, biochemistry and data programmes.",
  },
  {
    q: "Can I apply to more than one department?",
    a: "Yes. You interview with the department(s) of your choice, so tell us which ones interest you.",
  },
  {
    q: "How much time does it take?",
    a: "Around {hours} hours a week, with peaks in weeks with events or deliverables.",
  },
  {
    q: "When is the next recruitment?",
    a: "In the {season} {year} semester. The dates will be announced here and on our Instagram and LinkedIn; leave your details above and we'll tell you when applications open.",
  },
];

function formatDate(iso: string, language: string) {
  return new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-GB", {
    day: "numeric",
    month: "long",
  }).format(new Date(`${iso}T00:00:00`));
}

// "Notify me" — no backend: opens the visitor's email app with a message to
// the club's inbox already written, the same way the homepage contact form
// works. Chosen by the Board over a mailing-list service.
function NotifyForm({ seasonLabel }: { seasonLabel: string }) {
  const t = useT();
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = t("join.notify.subject", "Notify me: {seasonLabel} recruitment", { seasonLabel });
    const body = t(
      "join.notify.body",
      "Hi NFC,\n\nPlease let me know when applications for {seasonLabel} open.\n\nName: {name}\nCourse and year: {course}\n",
      { seasonLabel, name, course: course || "—" }
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const field =
    "w-full rounded-md border border-brand-cream/25 bg-brand-cream/95 px-3 py-2.5 text-sm text-brand-navy outline-none placeholder:text-brand-navy/50 focus-visible:ring-2 focus-visible:ring-brand-cream/60";

  return (
    <form onSubmit={handleSubmit} className="mt-5 text-left">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="sr-only" htmlFor="notify-name">
          {t("contact.yourName", "Your name")}
        </label>
        <input
          id="notify-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("contact.yourName", "Your name")}
          className={field}
        />
        <label className="sr-only" htmlFor="notify-course">
          {t("join.notify.course", "Course and year (optional)")}
        </label>
        <input
          id="notify-course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder={t("join.notify.coursePlaceholder", "Course & year (optional)")}
          className={field}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="group mt-3 h-auto min-h-10 w-full whitespace-normal bg-brand-cream py-2 text-brand-navy hover:bg-brand-cream/90"
      >
        <BellRing className="size-4 shrink-0 transition-transform group-hover:-rotate-12" />
        {t("join.notify.button", "Notify me when applications open")}
      </Button>
      <p className="mt-2 text-center text-xs text-brand-cream/60">
        {t("contact.opensEmailApp", "Opens your email app, addressed to {email}.", {
          email: siteConfig.email,
        })}
      </p>
    </form>
  );
}

export function JoinContent() {
  const t = useT();
  const { language } = useLanguage();
  const season = t(`season.${recruitment.season.toLowerCase()}`, recruitment.season);
  const seasonLabel = `${season} ${recruitment.year}`;
  const institution = t("institution.short", siteConfig.institution);

  const window_ =
    recruitment.applicationsOpen && recruitment.applicationsClose
      ? t("join.window", "{from} to {to}", {
          from: formatDate(recruitment.applicationsOpen, language),
          to: formatDate(recruitment.applicationsClose, language),
        })
      : t("join.datesTba", "dates to be announced");

  const processWhen = [
    `${seasonLabel} · ${window_}`,
    t("join.processWhen.1", "After applications close"),
    t("join.processWhen.2", "At the end of the process"),
  ];

  return (
    <div>
      <PageHeader
        title={<TypewriterTitle text={`<${t("join.heading", "Join Us")}>`} />}
        subtitle={
          <div
            id="notify"
            className="mx-auto max-w-lg scroll-mt-28 rounded-lg border border-brand-cream/20 bg-brand-cream/10 px-6 py-6 sm:px-8"
          >
            <p className="font-heading text-lg font-bold tracking-normal text-brand-cream">
              {recruitment.open
                ? t("join.applicationsOpen", "Applications open")
                : t("join.applicationsClosed", "Applications closed")}
            </p>
            <p className="mt-1 text-sm text-brand-cream/70">
              {t("join.nextRecruitmentWhen", "Next recruitment: {seasonLabel}, {window}", {
                seasonLabel,
                window: window_,
              })}
            </p>
            {!recruitment.open && <NotifyForm seasonLabel={seasonLabel} />}
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="mx-auto max-w-2xl space-y-4 text-center text-foreground/80">
          <p>
            {t(
              "join.intro1",
              "By joining {shortName} you'll get to know other students who are into finance, follow what's actually happening in markets and the economy, and put some of what you learn in class into practice.",
              { shortName: siteConfig.shortName }
            )}
          </p>
          <p>
            {t(
              "join.intro2",
              "Our members put in a real amount of their free time, and they'd tell you it's worth it. If finance is your thing, don't miss the next recruitment round."
            )}
          </p>
        </Reveal>

        {/* At a glance */}
        <StaggerGroup className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: t("join.glance.who", "Who can apply"),
              value: t("join.glance.whoValue", "Any {institution} student, any course, any year", { institution }),
            },
            {
              label: t("join.glance.time", "Time commitment"),
              value: t("join.glance.timeValue", "{hours} hours a week", { hours: recruitment.weeklyHours }),
            },
            {
              label: t("join.glance.next", "Next round"),
              value: seasonLabel,
            },
          ].map((item) => (
            <StaggerItem key={item.label}>
              <div className="h-full rounded-lg border p-5 text-center">
                <p className="text-xs font-semibold tracking-wide text-foreground/60 uppercase">{item.label}</p>
                <p className="mt-2 font-heading text-lg font-bold tracking-normal">{item.value}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Who should apply */}
        <section className="mt-16 border-t pt-16">
          <Reveal className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-normal sm:text-4xl">
              {t("join.whoShouldApplyHeading", "Who should apply?")}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-foreground/70">
              {t("join.whoShouldApplySubtitle", "We're looking for students across the following departments.")}
            </p>
          </Reveal>

          <StaggerGroup className="mt-12 grid gap-10 sm:grid-cols-2">
            {departments.map((dept) => {
              const pitch = departmentPitch[dept.slug];
              if (!pitch) return null;
              return (
                <StaggerItem key={dept.slug}>
                  <Link href={`/departments/${dept.slug}`} className="group flex items-start gap-4">
                    <Image
                      src={dept.badgeImage}
                      alt=""
                      width={80}
                      height={80}
                      className="shrink-0 rounded-sm transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-2deg] motion-reduce:transform-none"
                    />
                    <div>
                      <h3 className="font-heading text-lg font-bold tracking-normal">
                        <span className="link-underline">{t(`dept.${dept.slug}.short`, pitch.label)}</span>
                      </h3>
                      <p className="mt-1 text-sm text-foreground/70">
                        {t("join.pitchLead", "It's for you if you:")}
                      </p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-foreground/80">
                        {pitch.lookingFor.map((line, i) => (
                          <li key={line}>{t(`join.pitch.${dept.slug}.${i}`, line)}</li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </section>

        {/* How the process works — with the calendar alongside each step */}
        <section className="mt-16 border-t pt-16 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-bold tracking-normal sm:text-4xl">
              {t("join.processHeading", "How the process works")}
            </h2>
          </Reveal>

          <StaggerGroup className="mt-12 grid gap-10 sm:grid-cols-3">
            {process.map((step, i) => (
              <StaggerItem key={step}>
                <p className="font-heading text-4xl font-bold text-brand-navy/25">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-foreground/90">{t(`join.process.${i}`, step)}</p>
                <p className="mt-1 text-xs tracking-wide text-foreground/60 uppercase">{processWhen[i]}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        {/* FAQ — native <details>, so answers are in the HTML (searchable,
            indexable) and work without JavaScript. */}
        <section className="mx-auto mt-16 max-w-3xl border-t pt-16">
          <Reveal className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-normal sm:text-4xl">
              {t("join.faqHeading", "Frequently asked questions")}
            </h2>
          </Reveal>
          <Reveal className="mt-10 divide-y border-y">
            {faqs.map((faq, i) => (
              <details key={faq.q} className="group/faq py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading text-lg font-bold tracking-normal [&::-webkit-details-marker]:hidden">
                  {t(`join.faq.${i}.q`, faq.q)}
                  <ChevronDown className="size-5 shrink-0 text-foreground/50 transition-transform duration-300 group-open/faq:rotate-180" />
                </summary>
                <p className="pb-5 leading-relaxed text-foreground/80">
                  {t(`join.faq.${i}.a`, faq.a, {
                    institution,
                    hours: recruitment.weeklyHours,
                    season,
                    year: recruitment.year,
                  })}
                </p>
              </details>
            ))}
          </Reveal>
        </section>

        <Reveal className="mt-16 text-center text-sm text-foreground/70">
          {t("join.questions", "Questions? Reach out at")}{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {siteConfig.email}
          </a>
        </Reveal>
      </div>
    </div>
  );
}
