"use client";

import Image from "next/image";
import { Link } from "@/components/locale-link";

import { navItems, siteConfig } from "@/lib/site-data";
import { useT } from "@/lib/language";
import { Reveal } from "@/components/motion-primitives";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const t = useT();

  return (
    <footer className="border-t">
      <Reveal className="mx-auto max-w-7xl px-6 py-8 text-sm text-muted-foreground">
        <div className="grid grid-cols-1 items-center gap-4 text-center sm:grid-cols-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 sm:justify-self-start"
          >
            <Image
              src="/brand/nfc-mark-navy.png"
              alt=""
              width={32}
              height={32}
            />
            <span className="font-heading text-sm font-bold text-foreground">
              {siteConfig.name} ({siteConfig.shortName})
            </span>
          </Link>

          <p className="sm:justify-self-center">
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Instagram
            </a>
            {" · "}
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            {" · "}
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="transition-colors hover:text-foreground sm:justify-self-end"
          >
            {siteConfig.email}
          </a>
        </div>

        <nav
          aria-label={t("footer.navLabel", "Site")}
          className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t pt-4"
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="link-underline transition-colors hover:text-foreground">
              {t(`nav.${item.label.toLowerCase().replace(/\s+/g, "")}`, item.label)}
            </Link>
          ))}
        </nav>

        <p className="mt-4 text-center text-xs">
          © {year} {siteConfig.name}. {t("footer.mandate", "Mandate")} {siteConfig.mandate}.
        </p>
      </Reveal>
    </footer>
  );
}
