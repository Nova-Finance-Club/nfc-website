"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

import { useLocalizedHref } from "@/lib/language";

/**
 * Drop-in replacement for next/link on internal links: prefixes the href
 * with "/pt" on Portuguese pages, so readers stay in their language as they
 * navigate. External URLs and plain "#anchor" hrefs pass through untouched.
 */
export function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const localize = useLocalizedHref();
  const resolved = typeof href === "string" ? localize(href) : href;
  return <NextLink href={resolved} {...props} />;
}

export default Link;
