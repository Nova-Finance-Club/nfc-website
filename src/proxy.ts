import { NextResponse, type NextRequest } from "next/server";

// Language routing. Pages live under app/[lang]/, but English is served at
// the root: "/about" is rewritten (invisibly) to "/en/about", while
// Portuguese keeps its visible "/pt" prefix. See src/lib/i18n.ts.
//
// - "/en/..." typed by hand redirects to the unprefixed URL (one canonical
//   address per page).
// - A reader who picked Portuguese with the toggle (cookie "nfc-lang=pt")
//   is sent to the /pt version of an English URL. Crawlers carry no cookie,
//   so both languages stay indexable.
const LANGUAGE_COOKIE = "nfc-lang";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/pt" || pathname.startsWith("/pt/")) {
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (request.cookies.get(LANGUAGE_COOKIE)?.value === "pt") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/pt" : `/pt${pathname}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next internals, API routes and files with an
  // extension (images, icon.png, sitemap.xml, robots.txt, ...).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
