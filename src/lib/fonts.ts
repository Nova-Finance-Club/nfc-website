import localFont from "next/font/local";

// The whole site uses Libre Baskerville — no separate body/sans font (see
// globals.css, where --font-sans is aliased to --font-heading). Self-hosted
// from src/fonts/ (SIL Open Font License) rather than fetched from Google
// Fonts at build time: builds don't depend on Google being reachable, and
// visitors' browsers never contact Google either. Shared by both root
// layouts (app/[lang]/layout.tsx and app/global-not-found.tsx).
export const libreBaskerville = localFont({
  variable: "--font-heading",
  display: "swap",
  src: [
    { path: "../fonts/libre-baskerville-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/libre-baskerville-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});
