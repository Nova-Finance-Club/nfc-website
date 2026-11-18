"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useT } from "@/lib/language";
import type { PageFlip } from "page-flip/dist/js/page-flip.module.js";

// A PDF report read as a book: pdf.js draws each page in the browser, and
// page-flip turns them with a page-curl (drag a corner, click a page edge,
// swipe, or use the arrows / arrow keys). The cover sits alone, like a
// closed book; after that pages come in spreads of two, or one at a time
// on a narrow screen. Everything is drawn from the PDF itself, so adding a
// report is still just dropping its file in public/articles.

// Widest a single page gets, in CSS px. A spread is twice this.
const MAX_PAGE_WIDTH = 520;
// Below twice this, the book shows one page at a time.
const MIN_PAGE_WIDTH = 240;

type Status = "loading" | "ready" | "error";

export function PdfFlipbook({ src, title }: { src: string; title: string }) {
  const t = useT();
  const hostRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<PageFlip | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [spread, setSpread] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const urls: string[] = [];
    // page-flip removes the element it's given when destroyed, so it gets
    // its own child rather than a node React owns.
    const mount = document.createElement("div");

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
        const { PageFlip } = await import("page-flip/dist/js/page-flip.module.js");

        const pdf = await pdfjs.getDocument(src).promise;
        const first = (await pdf.getPage(1)).getViewport({ scale: 1 });
        const ratio = first.height / first.width;
        // Fit a page within the viewport's height as well as the column.
        const pageWidth = Math.round(
          Math.max(MIN_PAGE_WIDTH, Math.min(MAX_PAGE_WIDTH, (window.innerHeight * 0.78) / ratio))
        );
        // Draw sharp enough for the largest the page will be shown.
        const drawWidth = Math.min(1600, pageWidth * Math.max(2, window.devicePixelRatio || 1));

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
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.9)
          );
          if (!blob) throw new Error("Could not encode page");
          urls.push(URL.createObjectURL(blob));
          if (cancelled) return;
        }
        if (cancelled) return;

        // One element per page, made here for page-flip to take over.
        const pages = urls.map((url, i) => {
          const el = document.createElement("div");
          el.className = "flip-page";
          const img = document.createElement("img");
          img.src = url;
          img.alt = `${i + 1}`;
          img.draggable = false;
          el.appendChild(img);
          mount.appendChild(el);
          return el;
        });
        host.appendChild(mount);
        const book = new PageFlip(mount, {
          width: pageWidth,
          height: Math.round(pageWidth * ratio),
          size: "stretch",
          minWidth: MIN_PAGE_WIDTH,
          maxWidth: pageWidth,
          minHeight: Math.round(MIN_PAGE_WIDTH * ratio),
          maxHeight: Math.round(pageWidth * ratio),
          showCover: true,
          usePortrait: true,
          maxShadowOpacity: 0.4,
          flippingTime: 700,
          mobileScrollSupport: true,
        });
        book.on("flip", (e) => setPage(e.data));
        book.on("changeOrientation", (e) => setSpread(e.data === "landscape"));
        book.loadFromHTML(pages);
        bookRef.current = book;
        setPageCount(book.getPageCount());
        setSpread(book.getOrientation() === "landscape");
        setPage(book.getCurrentPageIndex());
        setStatus("ready");
      } catch (err) {
        console.error("[PdfFlipbook]", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      bookRef.current?.destroy();
      bookRef.current = null;
      mount.remove();
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [src]);

  // In a spread the left page is the current one; the cover stands alone.
  const shown =
    spread && page > 0 && page + 1 < pageCount ? `${page + 1}–${page + 2}` : `${page + 1}`;
  const atStart = page === 0;
  const atEnd = spread ? page + (page === 0 ? 1 : 2) >= pageCount : page + 1 >= pageCount;

  return (
    <div
      role="region"
      aria-roledescription={t("article.flipbook", "Book")}
      aria-label={title}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") bookRef.current?.flipNext();
        if (e.key === "ArrowLeft") bookRef.current?.flipPrev();
      }}
      className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
    >
      {status !== "ready" && (
        <div className="mx-auto flex aspect-[4/3] max-w-3xl items-center justify-center rounded-lg border border-dashed bg-brand-cream/30 p-6 text-center text-sm text-foreground/60">
          {status === "loading"
            ? t("article.pdfLoading", "Loading the report…")
            : t("article.pdfError", "The report couldn't be shown here. Open the PDF above to read it.")}
        </div>
      )}
      <div ref={hostRef} className="mx-auto drop-shadow-xl" />

      {status === "ready" && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => bookRef.current?.flipPrev()}
            disabled={atStart}
            aria-label={t("article.prevPage", "Previous page")}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border bg-background transition-colors hover:bg-brand-cream/60 disabled:cursor-default disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="min-w-20 text-center text-sm text-muted-foreground tabular-nums" aria-live="polite">
            {shown} / {pageCount}
          </p>
          <button
            type="button"
            onClick={() => bookRef.current?.flipNext()}
            disabled={atEnd}
            aria-label={t("article.nextPage", "Next page")}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border bg-background transition-colors hover:bg-brand-cream/60 disabled:cursor-default disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
