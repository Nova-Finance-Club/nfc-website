"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Link } from "@/components/locale-link";
import { BracketWordmark } from "@/components/bracket-wordmark";
import { departments, governanceUnits, navItems, recruitment, siteConfig } from "@/lib/site-data";
import { stripLanguage } from "@/lib/i18n";
import { useT } from "@/lib/language";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const departmentUnits = [...governanceUnits, ...departments];

// Header compacts (80px -> 64px, smaller mark) once the page scrolls past
// this many pixels.
const COMPACT_AFTER = 24;

export function SiteHeader() {
  // usePathname can report the internal "/en/..." route during prerender and
  // the visible "/..." URL in the browser; stripping the language prefix
  // makes both agree.
  const pathname = stripLanguage(usePathname() || "/");
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const t = useT();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > COMPACT_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLabel = (label: string) =>
    t(`nav.${label.toLowerCase().replace(/\s+/g, "")}`, label);
  // Short form, dropping the "Department" suffix — matches the name shown
  // on the unit's own page (h1, switcher pills, tab title). Governance
  // units (Board, General Council) never had the suffix.
  const unitName = (unit: (typeof departmentUnits)[number]) =>
    "coordinator" in unit
      ? t(`dept.${unit.slug}.short`, unit.name.replace(/ Department$/, ""))
      : t(`gov.${unit.slug}.name`, unit.name);

  const season = t(`season.${recruitment.season.toLowerCase()}`, recruitment.season);
  const joinLabel = recruitment.open
    ? t("nav.joinButtonOpen", "Apply: {season} {year}", { season, year: recruitment.year })
    : t("nav.joinButton", "Join Us: {season} {year}", { season, year: recruitment.year });

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const desktopItems = navItems.filter(
    (item) => item.label !== "About Us" && item.label !== "Departments" && item.label !== "Join"
  );

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "sticky top-0 z-40 border-b bg-background/95 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-background/80",
        compact && "shadow-[0_1px_12px_-4px_rgb(10_46_74/0.18)]"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 transition-[height] duration-300 ease-out",
          compact ? "h-16" : "h-20"
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={siteConfig.name}>
          <Image
            src="/brand/nfc-mark-navy.png"
            alt=""
            width={48}
            height={48}
            priority
            className={cn(
              "transition-[width,height] duration-300 ease-out",
              compact ? "size-10" : "size-12"
            )}
          />
          {/* Hidden between lg and xl, where the full nav needs the room —
              the NFC mark alone carries the brand there. */}
          <span className="font-heading text-base font-bold tracking-normal whitespace-nowrap lg:hidden xl:inline">
            <BracketWordmark text={siteConfig.name} variant="header" animate={pathname !== "/"} />
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t("nav.mainLabel", "Main")}>
          <Link
            href="/about"
            aria-current={isActive("/about") ? "page" : undefined}
            className={cn(
              "nav-link rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
              isActive("/about") && "text-foreground"
            )}
          >
            {navLabel("About Us")}
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "text-muted-foreground hover:text-foreground",
                    isActive("/departments") && "text-foreground"
                  )}
                >
                  {navLabel("Departments")}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-64">
                  {departmentUnits.map((unit) => (
                    <NavigationMenuLink
                      key={unit.slug}
                      render={<Link href={`/departments/${unit.slug}`} />}
                    >
                      <Image
                        src={unit.badgeImage}
                        alt=""
                        width={24}
                        height={24}
                      />
                      {unitName(unit)}
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {desktopItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "nav-link rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                isActive(item.href) && "text-foreground"
              )}
            >
              {navLabel(item.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <LanguageToggle />
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/join" />}
            className="font-heading text-base"
          >
            {joinLabel}
          </Button>
        </div>

        {/* Below lg: the language switch lives inside the menu, so the club's
            name fits on one line on phones. */}
        <div className="flex items-center lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("nav.openMenu", "Open menu")}
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 overflow-y-auto px-4 pb-6">
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                    isActive("/about") && "bg-accent text-foreground font-medium"
                  )}
                >
                  {navLabel("About Us")}
                </Link>

                <p className="mt-2 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {navLabel("Departments")}
                </p>
                {departmentUnits.map((unit) => (
                  <Link
                    key={unit.slug}
                    href={`/departments/${unit.slug}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-2 py-2 pl-4 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                      pathname === `/departments/${unit.slug}` &&
                        "bg-accent text-foreground font-medium"
                    )}
                  >
                    {unitName(unit)}
                  </Link>
                ))}

                <div className="mt-2 border-t pt-2">
                  {navItems
                    .filter((item) => item.label !== "About Us" && item.label !== "Departments")
                    .map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                          isActive(item.href) && "bg-accent text-foreground font-medium"
                        )}
                      >
                        {navLabel(item.label)}
                      </Link>
                    ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t px-2 pt-4">
                  <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {t("language.label", "Language")}
                  </span>
                  <LanguageToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
