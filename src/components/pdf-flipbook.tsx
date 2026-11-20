"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, X } from "lucide-react";

import { useT } from "@/lib/language";
import { cn } from "@/lib/utils";
import type { PageFlip } from "page-flip/dist/js/page-flip.module.js";

// A PDF report read as a book: page-flip turns the pages with a page-curl
// (drag a corner, click a page edge, swipe, or use the arrows / arrow keys).
// It opens on the first two pages side by side and goes on in spreads of
// two (1–2, 3–4, …), or one page at a time on a narrow screen.
//
// The pages are images pre-rendered from the PDF by
// scripts/render-pdf-pages.mjs (`npm run render-pdfs`) into
// public/articles/pages/<pdf name>/, so the book shows as soon as the first
// two images arrive. A PDF that hasn't been rendered yet still works: pdf.js
// then draws it in the browser, which is much slower.
//
// "Full screen" opens the book over the whole window at the largest size
// that fits, where it can also be zoomed in to read the small print.

// Widest a single page gets in the article column, in CSS px.
const MAX_PAGE_WIDTH = 640;
// Widest a single page gets in full screen.
const MAX_FULLSCREEN_PAGE_WIDTH = 1100;
// Below twice this, the book shows one page at a time.
const MIN_PAGE_WIDTH = 240;
const ZOOMS = [1, 1.5, 2, 3];

type Status = "loading" | "ready" | "error";
type PageImage = { src: string; srcSet?: string; large: string };
type Book = { pages: PageImage[]; ratio: number };

// public/articles/x.pdf -> public/articles/pages/x/
function pagesDir(src: string) {
  const slash = src.lastIndexOf("/");
  return `${src.slice(0, slash)}/pages/${src.slice(slash + 1).replace(/\.pdf$/i, "")}`;
}

async function loadPrerendered(src: string): Promise<Book | null> {
  const dir = pagesDir(src);
  const res = await fetch(`${dir}/manifest.json`).catch(() => null);
  if (!res?.ok) return null;
  const { pages, width, height } = (await res.json()) as { pages: number; width: number; height: number };
  return {
    ratio: height / width,
    pages: Array.from({ length: pages }, (_, i) => {
      const small = `${dir}/${i + 1}.webp`;
      const large = `${dir}/${i + 1}@2x.webp`;
      return { src: small, srcSet: `${small} 1200w, ${large} 2400w`, large };
    }),
  };
}

// Fallback for a PDF without pre-rendered pages: draw it with pdf.js.
async function renderInBrowser(src: string, isCancelled: () => boolean, urls: string[]): Promise<Book | null> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  const pdf = await pdfjs.getDocument(src).promise;
  const first = (await pdf.getPage(1)).getViewport({ scale: 1 });
  const drawWidth = Math.min(2000, MAX_PAGE_WIDTH * Math.max(2, window.devicePixelRatio || 1));
  for (let n = 1; n <= pdf.numPages; n++) {
    const pdfPage = await pdf.getPage(n);
    const base = pdfPage.getViewport({ scale: 1 });
    const viewport = pdfPage.getViewport({ scale: drawWidth / base.width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No 2D canvas");
    await pdfPage.render({ canvasContext: context, viewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (!blob) throw new Error("Could not encode page");
    urls.push(URL.createObjectURL(blob));
    if (isCancelled()) return null;
  }
  return { ratio: first.height / first.width, pages: urls.map((url) => ({ src: url, large: url })) };
}

export function PdfFlipbook({ src, title }: { src: string; title: string }) {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<PageFlip | null>(null);
  const pageRef = useRef(0);
  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [page, setPage] = useState(0);
  const [spread, setSpread] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // Load the page images (or draw the PDF) once per report.
  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];
    (async () => {
      try {
        const loaded = (await loadPrerendered(src)) ?? (await renderInBrowser(src, () => cancelled, urls));
        if (cancelled || !loaded) return;
        setBook(loaded);
        setStatus("ready");
      } catch (err) {
        console.error("[PdfFlipbook]", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [src]);

  const fullscreenRef = useRef(false);
  useEffect(() => {
    fullscreenRef.current = fullscreen;
  }, [fullscreen]);

  // Re-lay out the book when the window changes size. On phones the address
  // bar showing and hiding (which a swipe on the book can trigger) changes
  // the window's height by a little; rebuilding the book for that made the
  // page jump, so in the article column only width changes and big height
  // changes count.
  useEffect(() => {
    let timer: number | undefined;
    const measure = () =>
      setViewport((prev) => {
        const next = { w: window.innerWidth, h: window.innerHeight };
        const minor = next.w === prev.w && Math.abs(next.h - prev.h) < 200;
        return prev.w && minor && !fullscreenRef.current ? prev : next;
      });
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(measure, 150);
    };
    measure();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Build the book at the size that fits: the article column normally, the
  // whole window in full screen. Rebuilt on resize, keeping the open page.
  useEffect(() => {
    const host = hostRef.current;
    if (!book || !host || !viewport.w) return;
    let cancelled = false;
    // page-flip removes the element it's given when destroyed, so it gets
    // its own child rather than a node React owns.
    const mount = document.createElement("div");

    host.style.maxWidth = "";
    const availableWidth = fullscreen ? viewport.w - 32 : host.clientWidth;
    // Normally: the window less the site header and the buttons below the book.
    const availableHeight = fullscreen ? viewport.h - 120 : viewport.h - 180;
    const fitsSpread = availableWidth >= 2 * MIN_PAGE_WIDTH;
    const pageWidth = Math.round(
      Math.max(
        MIN_PAGE_WIDTH,
        Math.min(
          fullscreen ? MAX_FULLSCREEN_PAGE_WIDTH : MAX_PAGE_WIDTH,
          fitsSpread ? availableWidth / 2 : availableWidth,
          availableHeight / book.ratio
        )
      )
    );
    host.style.maxWidth = `${(fitsSpread ? 2 : 1) * pageWidth}px`;

    const pages = book.pages.map((p, i) => {
      const el = document.createElement("div");
      el.className = "flip-page";
      const img = document.createElement("img");
      if (p.srcSet) {
        img.srcset = p.srcSet;
        img.sizes = `${pageWidth}px`;
      }
      img.src = p.src;
      img.alt = `${i + 1}`;
      img.draggable = false;
      img.decoding = "async";
      // The opening spread first; the rest follow.
      if (i < 2) img.setAttribute("fetchpriority", "high");
      el.appendChild(img);
      mount.appendChild(el);
      return el;
    });
    host.appendChild(mount);

    (async () => {
      const { PageFlip } = await import("page-flip/dist/js/page-flip.module.js");
      if (cancelled) return;
      const flip = new PageFlip(mount, {
        width: pageWidth,
        height: Math.round(pageWidth * book.ratio),
        size: "stretch",
        minWidth: MIN_PAGE_WIDTH,
        maxWidth: pageWidth,
        minHeight: Math.round(MIN_PAGE_WIDTH * book.ratio),
        maxHeight: Math.round(pageWidth * book.ratio),
        showCover: false,
        usePortrait: true,
        maxShadowOpacity: 0.4,
        flippingTime: 700,
        mobileScrollSupport: !fullscreen,
        startPage: Math.min(pageRef.current, book.pages.length - 1),
      });
      flip.on("flip", (e) => {
        pageRef.current = e.data;
        setPage(e.data);
      });
      flip.on("changeOrientation", (e) => setSpread(e.data === "landscape"));
      flip.loadFromHTML(pages);
      bookRef.current = flip;
      host.style.minHeight = "";
      pageRef.current = flip.getCurrentPageIndex();
      setPage(pageRef.current);
      setSpread(flip.getOrientation() === "landscape");
    })();

    return () => {
      cancelled = true;
      // Hold the book's height while it's rebuilt, so the page below it
      // doesn't move up and back.
      host.style.minHeight = `${host.offsetHeight}px`;
      bookRef.current?.destroy();
      bookRef.current = null;
      mount.remove();
    };
  }, [book, fullscreen, viewport]);

  // Full screen: the book covers the window (and the screen, where the
  // browser allows it), and the page behind stops scrolling.
  useEffect(() => {
    if (!fullscreen) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      html.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [fullscreen]);

  const openFullscreen = () => {
    setZoom(1);
    setFullscreen(true);
    rootRef.current?.requestFullscreen?.().catch(() => {});
  };
  const closeFullscreen = () => {
    setZoom(1);
    setFullscreen(false);
  };

  const pageCount = book?.pages.length ?? 0;
  const step = spread ? 2 : 1;
  // In a spread the left page is the current one; an odd last page stands alone.
  const shown = spread && page + 1 < pageCount ? `${page + 1}–${page + 2}` : `${page + 1}`;
  const atStart = page === 0;
  const atEnd = page + step >= pageCount;
  const zoomed = zoom > 1;

  const go = (direction: 1 | -1) => {
    const flip = bookRef.current;
    if (!flip) return;
    if (!zoomed) {
      if (direction > 0) flip.flipNext();
      else flip.flipPrev();
      return;
    }
    // The book is hidden while zoomed, so turn without the animation.
    const target = Math.max(0, Math.min(pageCount - 1, page + direction * step));
    flip.turnToPage(target);
    pageRef.current = target;
    setPage(target);
  };

  const iconButton =
    "flex size-10 cursor-pointer items-center justify-center rounded-full border bg-background transition-colors hover:bg-brand-cream/60 disabled:cursor-default disabled:opacity-30";
  const zoomedPages = book ? book.pages.slice(page, page + step) : [];
  const zoomedWidth = Math.min(
    MAX_FULLSCREEN_PAGE_WIDTH,
    (viewport.w - 32) / step,
    (viewport.h - 120) / (book?.ratio ?? 1.414)
  ) * zoom;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription={t("article.flipbook", "Book")}
      aria-label={title}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className={cn(
        "rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
        fullscreen && "fixed inset-0 z-[60] flex flex-col rounded-none bg-[#e9e4d8] focus-visible:ring-0"
      )}
    >
      {fullscreen && (
        <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-brand-navy/10 bg-background/90 px-4">
          <p className="truncate font-heading text-sm font-bold sm:text-base">{title}</p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom(ZOOMS[Math.max(0, ZOOMS.indexOf(zoom) - 1)])}
              disabled={zoom === ZOOMS[0]}
              aria-label={t("article.zoomOut", "Zoom out")}
              className={cn(iconButton, "size-9")}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-12 text-center text-sm text-muted-foreground tabular-nums">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom(ZOOMS[Math.min(ZOOMS.length - 1, ZOOMS.indexOf(zoom) + 1)])}
              disabled={zoom === ZOOMS[ZOOMS.length - 1]}
              aria-label={t("article.zoomIn", "Zoom in")}
              className={cn(iconButton, "size-9")}
            >
              <Plus className="size-4" />
            </button>
            <button
              type="button"
              onClick={closeFullscreen}
              aria-label={t("article.exitFullscreen", "Close full screen")}
              className={cn(iconButton, "ml-2 size-9")}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {status !== "ready" && (
        <div className="mx-auto flex aspect-[4/3] w-full max-w-3xl items-center justify-center rounded-lg border border-dashed bg-brand-cream/30 p-6 text-center text-sm text-foreground/60">
          {status === "loading"
            ? t("article.pdfLoading", "Loading the report…")
            : t("article.pdfError", "The report couldn't be shown here. Open the PDF above to read it.")}
        </div>
      )}

      <div className={cn(fullscreen && "flex min-h-0 flex-1 items-center justify-center p-4", zoomed && "hidden")}>
        {/* Double-click a page to read it larger. */}
        <div
          ref={hostRef}
          onDoubleClick={() => !fullscreen && openFullscreen()}
          className="mx-auto w-full drop-shadow-xl"
        />
      </div>

      {zoomed && (
        // Zoomed in: the open page(s) as plain images, scrolled in both directions.
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
          <div className="mx-auto flex w-max gap-1 p-4">
            {zoomedPages.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.large}
                src={p.large}
                alt={`${page + i + 1}`}
                style={{ width: zoomedWidth }}
                className="block h-auto bg-white shadow-lg"
                draggable={false}
              />
            ))}
          </div>
        </div>
      )}

      {status === "ready" && (
        <div className={cn("flex items-center justify-center gap-4", fullscreen ? "h-16 shrink-0" : "mt-6")}>
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={atStart}
            aria-label={t("article.prevPage", "Previous page")}
            className={iconButton}
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="min-w-20 text-center text-sm text-muted-foreground tabular-nums" aria-live="polite">
            {shown} / {pageCount}
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={atEnd}
            aria-label={t("article.nextPage", "Next page")}
            className={iconButton}
          >
            <ChevronRight className="size-5" />
          </button>
          {!fullscreen && (
            <button
              type="button"
              onClick={openFullscreen}
              aria-label={t("article.fullscreen", "Full screen")}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border bg-background text-sm transition-colors hover:bg-brand-cream/60 max-sm:w-10 sm:ml-2 sm:px-4"
            >
              <Maximize2 className="size-4" />
              <span aria-hidden="true" className="max-sm:hidden">
                {t("article.fullscreen", "Full screen")}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
