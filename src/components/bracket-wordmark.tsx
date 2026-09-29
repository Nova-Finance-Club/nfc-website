import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * The club's `<Nova Finance Club>` wordmark, with the brackets opening to
 * reveal the name on first load. Pure CSS (see ".bracket-wordmark" in
 * globals.css): the full name is in the server HTML, so it reads correctly
 * without JavaScript and to screen readers (the brackets are aria-hidden),
 * and the animation only ever plays on a full page load — the header lives
 * in the layout, which persists across client-side navigations.
 *
 * - variant "header": animates at every width.
 * - variant "hero": animates from the sm breakpoint up only, because on
 *   phones the hero title wraps over several lines and a one-line reveal
 *   would overflow the screen.
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
  return (
    <span
      className={cn(
        "bracket-wordmark",
        animate && (variant === "hero" ? "bracket-wordmark--hero" : "bracket-wordmark--header"),
        className
      )}
      style={{ "--bw-chars": text.length } as CSSProperties}
    >
      <span className="bw-bracket bw-open" aria-hidden="true">
        &lt;
      </span>
      <span className="bw-text">{text}</span>
      <span className="bw-bracket bw-close" aria-hidden="true">
        &gt;
      </span>
    </span>
  );
}
