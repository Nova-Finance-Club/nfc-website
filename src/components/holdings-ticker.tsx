"use client";

import { useEffect, useRef } from "react";

import type { FundHolding } from "@/lib/fund-performance";
import { formatPercent } from "@/lib/fund-format";
import { useLanguage, useT } from "@/lib/language";

// A continuously scrolling strip of the fund's holdings, full-bleed under the
// /fund page header: ticker, name, weight, and the last day's move with an
// up/down arrow.
//
// The list is rendered twice (the second copy hidden from screen readers) and
// the strip is a real horizontal scroller: it advances by itself, and with the
// mouse over it the wheel/trackpad scrolls it by hand in either direction
// (touch swipes too). Whenever the position passes one copy's width it jumps
// back by exactly that width, so the loop never runs out either way.

const SECONDS_PER_HOLDING = 4;

function DayChange({ value }: { value: number | null | undefined }) {
  const { language } = useLanguage();
  const t = useT();
  if (value == null || !Number.isFinite(value)) return null;
  const rounded = Math.round(value * 10000);
  const direction = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  const tone =
    direction === "up" ? "text-emerald-700" : direction === "down" ? "text-red-700" : "text-foreground/50";
  return (
    <span className={`inline-flex items-baseline gap-1 text-sm font-semibold tabular-nums ${tone}`}>
      <span aria-hidden="true" className="text-[0.7em]">
        {direction === "up" ? "▲" : direction === "down" ? "▼" : "■"}
      </span>
      <span className="sr-only">
        {direction === "up"
          ? t("fund.ticker.up", "up")
          : direction === "down"
            ? t("fund.ticker.down", "down")
            : t("fund.ticker.flat", "unchanged")}
      </span>
      {formatPercent(Math.abs(value), language, { signed: false })}
    </span>
  );
}

export function HoldingsTicker({ holdings }: { holdings: FundHolding[] }) {
  const t = useT();
  const { language } = useLanguage();
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const firstCopy = firstCopyRef.current;
    if (!viewport || !firstCopy) return;

    let position = 0; // fractional scrollLeft; the browser may round its own
    let hovered = false;
    let touching = false;
    let lastFrame = performance.now();
    let frame = 0;

    const loopWidth = () => firstCopy.offsetWidth;
    const wrap = () => {
      const width = loopWidth();
      if (width <= 0) return;
      if (position >= width) position -= width;
      if (position < 0) position += width;
    };
    const apply = () => {
      wrap();
      viewport.scrollLeft = position;
    };

    const tick = (now: number) => {
      const elapsed = Math.min(now - lastFrame, 100); // no jump after a hidden tab
      lastFrame = now;
      if (!hovered && !touching) {
        const speed = loopWidth() / (holdings.length * SECONDS_PER_HOLDING); // px per second
        position += (speed * elapsed) / 1000;
        apply();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // Wheel over the strip scrolls it sideways instead of the page.
    const onWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;
      event.preventDefault();
      position += event.deltaMode === 1 ? delta * 16 : delta;
      apply();
    };
    // Touch swipes scroll natively; keep our position in step and wrap.
    const onScroll = () => {
      if (!touching) return;
      position = viewport.scrollLeft;
      const before = position;
      wrap();
      if (position !== before) viewport.scrollLeft = position;
    };
    const onEnter = () => (hovered = true);
    const onLeave = () => (hovered = false);
    const onTouchStart = () => (touching = true);
    const onTouchEnd = () => {
      touching = false;
      position = viewport.scrollLeft;
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("mouseenter", onEnter);
    viewport.addEventListener("mouseleave", onLeave);
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchend", onTouchEnd);
    viewport.addEventListener("touchcancel", onTouchEnd);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("mouseenter", onEnter);
      viewport.removeEventListener("mouseleave", onLeave);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [holdings.length]);

  if (holdings.length === 0) return null;

  const items = () =>
    holdings.map((holding) => (
      <li
        key={holding.ticker}
        className="flex shrink-0 items-baseline gap-2.5 border-r border-brand-navy/10 px-6 py-3.5"
      >
        <span className="text-sm font-bold tracking-wide">{holding.ticker}</span>
        <span className="max-w-48 truncate text-sm text-foreground/60">{holding.name}</span>
        <span className="text-sm text-foreground/60 tabular-nums">
          {formatPercent(holding.weight, language, { signed: false, digits: 1 })}
        </span>
        <DayChange value={holding.day_change} />
      </li>
    ));

  return (
    <section
      className="relative border-b border-brand-navy/10 bg-brand-cream/50"
      aria-label={t("fund.tickerLabel", "Holdings: portfolio weight and last day's move")}
    >
      <div
        ref={viewportRef}
        className="flex overflow-x-auto [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
      >
        <ul ref={firstCopyRef} className="flex shrink-0">
          {items()}
        </ul>
        <ul className="flex shrink-0" aria-hidden="true">
          {items()}
        </ul>
      </div>
    </section>
  );
}
