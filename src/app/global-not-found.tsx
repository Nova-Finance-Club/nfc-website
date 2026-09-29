import type { Metadata } from "next";

import { libreBaskerville } from "@/lib/fonts";
import Link from "next/link";
import "./globals.css";

// Unmatched URLs outside the two language trees (the app has one root
// layout per language, under app/[lang]/, so there's no single layout to
// compose a 404 from). In-site 404s use app/[lang]/not-found.tsx instead.
export const metadata: Metadata = {
  title: "Page not found — Nova Finance Club",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${libreBaskerville.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center px-6 text-center">
        <p className="font-heading text-7xl font-bold">&lt;404&gt;</p>
        <h1 className="mt-6 font-heading text-2xl font-bold">This page doesn&apos;t exist.</h1>
        <p className="mt-2 opacity-70">Esta página não existe.</p>
        <Link href="/" className="mt-8 underline underline-offset-4">
          Nova Finance Club
        </Link>
      </body>
    </html>
  );
}
