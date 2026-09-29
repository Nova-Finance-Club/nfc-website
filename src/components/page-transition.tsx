"use client";

import { ViewTransition, type ReactNode } from "react";

/**
 * Page-to-page transition (React <ViewTransition> + the browser View
 * Transitions API). Wraps each page's content — not the layout, which
 * persists across navigations so enter/exit would never fire there. The
 * header is pinned with its own view-transition-name (see site-header.tsx)
 * so only the content moves. The animations live in globals.css under
 * ".page-enter" / ".page-exit". Browsers without the API, and visitors
 * with reduced motion, simply get an instant swap.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}

/**
 * Shared element that morphs between two pages — e.g. an article cover in
 * the archive grid flying into the article page's hero. Both sides must use
 * the same `name`, and each name must appear only once per page.
 */
export function SharedElement({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
