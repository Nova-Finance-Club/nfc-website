This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- **Node.js 20.9+ or 22+** (Next.js 16 no longer supports Node 18). Check with `node -v`.
- **npm** (ships with Node). This repo tracks a `package-lock.json`, so npm is the expected package manager.

### Install dependencies

To install Next.js, React, Tailwind, and other dependencies, run:

```bash
npm install
```

For a clean, reproducible install that matches the lockfile exactly (recommended on a fresh clone):

```bash
npm ci
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build (run npm run build first)
npm run lint    # run ESLint
```

Pages live under `src/app/[lang]/` (see *Languages* below); almost all copy and data lives in `src/lib/site-data.ts`, with Portuguese in `src/lib/translations-pt.ts`.

## Languages

- English is served at the root (`/about`), Portuguese under `/pt` (`/pt/about`). Both are prerendered, so search engines index both.
- Every page sits in `src/app/[lang]/`. `src/proxy.ts` invisibly rewrites unprefixed URLs to the English tree, redirects a hand-typed `/en/...` to the clean URL, and sends a reader who picked PT on the toggle (cookie `nfc-lang`) to `/pt`.
- Internal links: import `Link` from `@/components/locale-link`, not `next/link` — it adds `/pt` when needed.
- Copy: write English inline with `t("some.key", "English text")` and add the Portuguese under the same key in `translations-pt.ts`.

## Things to update each cycle

- **Recruitment** — `recruitment` at the end of `site-data.ts` (open/closed, season, dates). Drives the header button, the home hero and `/join`.
- **Department photos** — set each department's `photo`, then flip `SHOW_DEPARTMENT_PHOTOS` to `true` once all four exist.
- **Articles** — each entry can take a `summary` and `authors`; both show on the article's own page and in share previews.

## Deployment settings

- `NEXT_PUBLIC_SITE_URL` — the public origin used for canonical URLs, hreflang, the sitemap and share images. Defaults to `https://novafinanceclub.vercel.app`; set it in Vercel when the club's own domain goes live.
- Fonts are self-hosted from `src/fonts/` (Libre Baskerville, SIL OFL) — the build never calls Google Fonts.

## Member data

Never commit member or alumni records (names with student numbers, courses, etc.). `/Data/` is git-ignored. Earlier commits did include `Data/*.csv`; removing them from the history needs a one-off rewrite by a repository admin:

```bash
pip install git-filter-repo
git clone --mirror https://github.com/Nova-Finance-Club/nfc-website.git
cd nfc-website.git
git filter-repo --path Data --invert-paths
git push --force --mirror
```

Everyone with a clone must then re-clone. GitHub may keep cached views of old commits for a while; GitHub Support can purge them.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
