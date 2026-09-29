"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Milliseconds per character. */
const TYPE_SPEED = 90;
/** Pause with just the empty brackets on screen before typing starts. */
const TYPE_DELAY = 400;

/**
 * A `<…>` title — the club's `<Nova Finance Club>` wordmark and every page
 * title. The brackets show first, empty; the name is then typed out between
 * them letter by letter. No caret: a title that only just fits its line
 * would be pushed onto a second one by the extra character while typing.
 *
 * The full text is in the server HTML (and in an sr-only copy that screen
 * readers use, since the visible letters change while typing), so it reads
 * correctly without JavaScript. Until hydration a short CSS hold keeps the
 * name hidden (see ".bracket-wordmark" in globals.css), so it doesn't flash
 * in full and then vanish when typing starts; without JS it appears once
 * the hold ends.
 *
 * Types regardless of prefers-reduced-motion: letters appearing in place
 * isn't the kind of motion that setting opts out of (nothing slides or
 * zooms), and skipping it hid the effect from anyone with Windows'
 * "Animation effects" turned off.
 *
 * Plays when the component mounts (and again if `text` changes, e.g. on a
 * language switch). `animate` is read at mount only: the header lives in
 * the layout, which persists across client-side navigations, so its
 * wordmark types on a full page load and not on every link click.
 *
 * - variant "header": stays on one line.
 * - variant "hero": may wrap, for long titles on small screens.
 */
export function BracketWordmark({
  text,
  animate = true,
  variant = "hero",
  className,
}: {
  text: string;
  animate?: boolean;
  variant?: "hero" | "header";
  className?: string;
}) {
  const [animateOnMount] = useState(animate);
  const rootRef = useRef<HTMLSpanElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const typed = typedRef.current;
    if (!animateOnMount || !root || !typed) return;

    // Written imperatively rather than through render state, like
    // TypewriterTitle: it runs after hydration, so there's nothing for
    // React to mismatch against.
    root.dataset.started = "";
    typed.textContent = "";

    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        typed.textContent = text.slice(0, i);
        if (i >= text.length) clearInterval(interval);
      }, TYPE_SPEED);
    }, TYPE_DELAY);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
      typed.textContent = text;
    };
  }, [text, animateOnMount]);

  return (
    <span
      ref={rootRef}
      className={cn("bracket-wordmark", variant === "hero" && "bracket-wordmark--hero", className)}
      data-animate={animateOnMount ? "" : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">&lt;</span>
      <span ref={typedRef} className="bw-text" aria-hidden="true">
        {text}
      </span>
      <span aria-hidden="true">&gt;</span>
    </span>
  );
}
