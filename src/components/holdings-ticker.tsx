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
    let hovered = false; // a real mouse over the strip (not a tap)
    let touching = false; // a finger on the strip
    // The user is scrolling it: a finger down, or the momentum glide after a
    // swipe, which keeps going after touchend. Auto-scroll must stay off until
    // that glide has settled, or the two fight frame by frame (visible lag).
    let userScrolling = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let lastFrame = performance.now();
    let frame = 0;

    const loopWidth = () => firstCopy.offsetWidth;
    // Both copies look identical, so any position can move by one copy's width
    // without a visible change. Keep it in the middle band [W/2, 3W/2) of the
    // scroll range, leaving half a loop of room to swipe either way.
    const wrap = () => {
      const width = loopWidth();
      if (width <= 0) return;
      while (position >= width * 1.5) position -= width;
      while (position < width * 0.5) position += width;
    };
    const apply = () => {
      wrap();
      viewport.scrollLeft = position;
    };

    const tick = (now: number) => {
      const elapsed = Math.min(now - lastFrame, 100); // no jump after a hidden tab
      lastFrame = now;
      if (!hovered && !userScrolling) {
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
    // Touch swipes scroll natively (including the momentum glide); we only
    // follow along. Once no scroll event has arrived for a moment and the
    // finger is up, the glide is over: wrap back into the loop (done then,
    // not mid-glide, since moving scrollLeft would cut the glide short) and
    // let auto-scroll carry on from where it stopped.
    const settleSoon = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        if (touching) return;
        position = viewport.scrollLeft;
        apply();
        lastFrame = performance.now();
        userScrolling = false;
      }, 180);
    };
    const onScroll = () => {
      if (!userScrolling) return; // our own auto-scroll moving it
      position = viewport.scrollLeft;
      settleSoon();
    };
    const onTouchStart = () => {
      touching = true;
      userScrolling = true;
      clearTimeout(settleTimer);
    };
    const onTouchEnd = () => {
      touching = false;
      settleSoon();
    };
    // Mouse only: on phones a tap also fires enter/leave, which would leave
    // the strip paused until the next tap elsewhere.
    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovered = true;
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovered = false;
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("pointerenter", onPointerEnter);
    viewport.addEventListener("pointerleave", onPointerLeave);
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });
    viewport.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("pointerenter", onPointerEnter);
      viewport.removeEventListener("pointerleave", onPointerLeave);
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
      // min-w-0 + overflow-hidden: the page's flex layout would otherwise size
      // this strip to its full content (both copies, ~10,000px) and the whole
      // page would scroll sideways. Only the inner viewport scrolls.
      className="relative min-w-0 max-w-full overflow-hidden border-b border-brand-navy/10 bg-brand-cream/50"
      aria-label={t("fund.tickerLabel", "Holdings: portfolio weight and last day's move")}
    >
      <div
        ref={viewportRef}
        className="flex w-full overflow-x-auto [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)] [&::-webkit-scrollbar]:hidden"
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
