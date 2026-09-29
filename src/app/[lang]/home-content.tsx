"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Link } from "@/components/locale-link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import {
  AnimatedStat,
  HeroParallax,
  HoverLift,
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion-primitives";
import { SharedElement } from "@/components/page-transition";
import { articles, departments, memberDegrees, missionStatement, recruitment, siteConfig } from "@/lib/site-data";
import { useT } from "@/lib/language";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/social-icons";
import { BracketWordmark } from "@/components/bracket-wordmark";

function handleFromUrl(url: string) {
  const segments = new URL(url).pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

const socialLinks = [
  { name: "Instagram", href: siteConfig.instagram, handle: `@${handleFromUrl(siteConfig.instagram)}`, Icon: InstagramIcon },
  { name: "LinkedIn", href: siteConfig.linkedin, handle: handleFromUrl(siteConfig.linkedin), Icon: LinkedinIcon },
  { name: "GitHub", href: siteConfig.github, handle: `@${handleFromUrl(siteConfig.github)}`, Icon: GithubIcon },
];

export function HomeContent() {
  const t = useT();
  const distinctBackgrounds = new Set(
    Object.values(memberDegrees).map((degree) => degree.name)
  ).size;
  const yearsActive = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <div>
      {/* Hero — full-bleed brand-navy band with the NOVA FCT/Lisbon banner */}
      <section className="relative isolate overflow-hidden bg-brand-navy text-brand-cream">
        <HeroParallax>
          <Image
            src="/brand/hero-banner.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </HeroParallax>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/80 via-brand-navy/60 to-brand-navy/40" />
        <StaggerGroup
          immediate
          className="relative mx-auto max-w-7xl px-6 pt-28 pb-32 sm:pt-40 sm:pb-48"
        >
          {/* Not in a StaggerItem: the title is the page's largest element,
              so it's visible from the first paint — the bracket reveal is
              its entrance. */}
          <h1 className="font-heading text-6xl leading-[1.05] font-bold sm:text-7xl">
            <BracketWordmark text={siteConfig.name} variant="hero" />
          </h1>
          <StaggerItem>
            <p className="mt-6 max-w-xl font-heading text-2xl text-brand-cream/85">
              {t("home.slogan", siteConfig.slogan)}
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-4 max-w-xl text-lg text-brand-cream/85">
              {t(
                "home.heroSubtitle",
                "We are a student-run finance club from {institutionFullName}.",
                { institutionFullName: t("institution.full", siteConfig.institutionFullName) }
              )}
            </p>
          </StaggerItem>

          <StaggerItem className="mt-9 flex flex-wrap gap-3">
            <HoverLift>
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/join#notify" />}
                className="group h-auto min-h-10 whitespace-normal bg-brand-cream py-2 text-left text-brand-navy hover:bg-brand-cream/90"
              >
                {recruitment.open
                  ? t("home.joinOpenButton", "Apply now — {season} {year}", {
                      season: t(`season.${recruitment.season.toLowerCase()}`, recruitment.season),
                      year: recruitment.year,
                    })
                  : t("home.joinButton", "Join us — get notified for {season} {year}", {
                      season: t(`season.${recruitment.season.toLowerCase()}`, recruitment.season),
                      year: recruitment.year,
                    })}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </HoverLift>
            <HoverLift>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<a href="#what-we-do" />}
                className="group border-brand-cream/40 bg-transparent text-brand-cream hover:bg-brand-cream/10 hover:text-brand-cream"
              >
                {t("home.whatWeDoButton", "What we do")}
                <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </Button>
            </HoverLift>
          </StaggerItem>
        </StaggerGroup>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        {/* Founding + mission */}
        <section className="mt-10 py-10 text-center">
          <Reveal>
            <p className="mx-auto max-w-3xl font-heading text-xl leading-relaxed sm:text-2xl">
              {t("site.missionStatement", missionStatement, {
                foundedYear: siteConfig.foundedYear,
                name: siteConfig.name,
                institutionFullName: t("institution.full", siteConfig.institutionFullName),
              })}
            </p>
          </Reveal>
        </section>

        {/* NFC in numbers */}
        <section className="mt-10 border-t py-16 text-center">
          <Reveal>
            <h2 className="font-heading text-4xl font-bold tracking-normal sm:text-5xl">
              {t("home.numbersHeading", "{shortName} in numbers", {
                shortName: siteConfig.shortName,
              })}
            </h2>
          </Reveal>
          <StaggerGroup className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-6">
            <StaggerItem className="flex flex-col items-center gap-1 sm:flex-row sm:items-baseline sm:justify-center sm:gap-2">
              <AnimatedStat
                value={siteConfig.memberCount}
                className="font-heading text-5xl font-bold tracking-normal sm:text-6xl"
              />
              <span className="text-sm text-muted-foreground sm:text-lg">
                {t("home.stat.members", "members")}
              </span>
            </StaggerItem>
            <StaggerItem className="flex flex-col items-center gap-1 sm:flex-row sm:items-baseline sm:justify-center sm:gap-2">
              <AnimatedStat
                value={departments.length}
                className="font-heading text-5xl font-bold tracking-normal sm:text-6xl"
              />
              <span className="text-sm text-muted-foreground sm:text-lg">
                {t("home.stat.departments", "departments")}
              </span>
            </StaggerItem>
            <StaggerItem className="flex flex-col items-center gap-1 sm:flex-row sm:items-baseline sm:justify-center sm:gap-2">
              <AnimatedStat
                value={distinctBackgrounds}
                className="font-heading text-5xl font-bold tracking-normal sm:text-6xl"
              />
              <span className="text-sm text-muted-foreground sm:text-lg">
                {t("home.stat.distinctBackgrounds", "distinct backgrounds")}
              </span>
            </StaggerItem>
            <StaggerItem className="flex flex-col items-center gap-1 sm:flex-row sm:items-baseline sm:justify-center sm:gap-2">
              <AnimatedStat
                value={yearsActive}
                className="font-heading text-5xl font-bold tracking-normal sm:text-6xl"
              />
              <span className="text-sm text-muted-foreground sm:text-lg">
                {t("home.stat.yearsActive", "years active")}
              </span>
            </StaggerItem>
          </StaggerGroup>
        </section>
      </div>

      {/* What we do — a full-bleed banner, breaking out of the max-w-7xl
          text column like the numbers/hero above it, so the homepage reads
          as distinct horizontal sections rather than one long scroll. Plain
          centered icon + title + description per department, no cards. */}
      <section id="what-we-do" className="mt-6 scroll-mt-24 border-y bg-brand-cream/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center">
            <h2 className="font-heading text-4xl font-bold tracking-normal sm:text-5xl">
              {t("home.whatWeDoHeading", "What we do")}
            </h2>
          </Reveal>

          <StaggerGroup className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => (
              <StaggerItem key={dept.slug}>
                <Link
                  href={`/departments/${dept.slug}`}
                  className="dept-card group flex h-full flex-col items-center rounded-xl px-4 py-6 text-center"
                  style={{ "--dept-accent": dept.accent } as CSSProperties}
                >
                  <SharedElement name={`dept-badge-${dept.slug}`}>
                    <Image
                      src={dept.badgeImage}
                      alt=""
                      width={96}
                      height={96}
                      className="rounded-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:rotate-[-2deg] motion-reduce:transform-none"
                    />
                  </SharedElement>
                  <h3 className="dept-card-title mt-4 font-heading text-lg font-bold tracking-normal">
                    {t(`dept.${dept.slug}.name`, dept.name)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`dept.${dept.slug}.summary`, dept.summary)}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        {/* Latest Articles */}
        <section className="py-16 text-center">
          <Reveal>
            <h2 className="font-heading text-4xl font-bold tracking-normal sm:text-5xl">
              {t("home.articlesHeading", "Latest Articles")}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              {t(
                "home.articlesSubtitle",
                "Recurring editorial series and markets reports, published across departments."
              )}
            </p>
          </Reveal>
          {articles.length > 0 ? (
            <Reveal delay={0.1} className="mx-auto mt-6 max-w-2xl divide-y overflow-hidden rounded-md border text-left">
              {articles.slice(0, 3).map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex items-center justify-between gap-4 p-4 text-sm font-medium transition-colors hover:bg-brand-cream/40"
                >
                  <span className="link-underline">{t(`article.${article.slug}.title`, article.title)}</span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
                </Link>
              ))}
            </Reveal>
          ) : (
            <Reveal
              delay={0.1}
              className="mt-6 rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground"
            >
              {t("home.articlesEmpty", "No articles published yet.")}
            </Reveal>
          )}
          <Reveal delay={0.15} className="mt-4">
            <Link
              href="/articles"
              className="text-sm font-medium text-foreground underline underline-offset-4"
            >
              {t("home.browseArchive", "Browse the archive")}
            </Link>
          </Reveal>
        </section>

        {/* NFC Fund */}
        <section className="border-t py-16 text-center">
          <Reveal>
            <h2 className="font-heading text-4xl font-bold tracking-normal sm:text-5xl">
              {t("home.fundHeading", "{shortName} Fund", { shortName: siteConfig.shortName })}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              {t(
                "home.fundSubtitle",
                "The Investments Department's virtual fund. Mandate, methodology and quarterly reporting."
              )}
            </p>
            <Link
              href="/fund"
              className="group mt-4 inline-flex items-center gap-1 text-sm font-medium"
            >
              <span className="link-underline">{t("home.seeFund", "See the fund")}</span>
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </section>
      </div>

      {/* Follow us — one compact row of three channels (it used to take a
          full screen for three links). Each link nudges its arrow on hover
          and shows the handle. */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Reveal className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <h2 className="font-heading text-3xl font-bold tracking-normal sm:text-4xl">
              {t("home.followUsHeading", "Follow us")}
            </h2>
            <ul className="grid w-full gap-3 sm:grid-cols-3 md:w-auto">
              {socialLinks.map(({ name, href, handle, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors duration-300 hover:border-brand-navy/40 hover:bg-brand-cream/40"
                  >
                    <Icon className="size-6 shrink-0" />
                    <span className="min-w-0">
                      <span className="block font-heading text-base font-bold">{name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{handle}</span>
                    </span>
                    <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Get in touch — a full-bleed navy banner, after the Contact Us
          section on investmentclub.tecnico.ulisboa.pt: centered heading,
          name + email side by side, message below, centered submit. The
          footer already carries the raw email/social links on every page,
          so this section's job is the interactive form, not a repeat of
          those links. */}
      <section
        id="contact"
        className="scroll-mt-24 bg-brand-navy py-20 text-brand-cream"
      >
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <h2 className="font-heading text-4xl font-bold tracking-normal sm:text-5xl">
              {t("home.getInTouchHeading", "Get in Touch")}
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
