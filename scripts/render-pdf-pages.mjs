// Pre-renders every PDF report in public/articles into page images, so the
// flipbook (src/components/pdf-flipbook.tsx) shows plain images instead of
// downloading the PDF and drawing it page by page in the visitor's browser.
//
//   npm run render-pdfs
//
// For public/articles/<name>.pdf it writes public/articles/pages/<name>/:
//   1.webp, 2.webp, …        each page 1200px wide (the book)
//   1@2x.webp, 2@2x.webp, …  each page 2400px wide (full screen and zoom)
//   manifest.json            { pages, width, height } of the first page
// A PDF whose manifest is newer than the PDF itself is skipped. Without a
// manifest the flipbook falls back to drawing the PDF in the browser, so a
// newly dropped report still shows before this has been run.

import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";
import sharp from "sharp";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const articlesDir = path.join(root, "public", "articles");
const SIZES = [
  { suffix: "", width: 1200, quality: 82 },
  { suffix: "@2x", width: 2400, quality: 80 },
];

async function mtime(file) {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

const force = process.argv.includes("--force");
const pdfs = (await readdir(articlesDir)).filter((f) => f.toLowerCase().endsWith(".pdf"));

for (const file of pdfs) {
  const name = file.replace(/\.pdf$/i, "");
  const src = path.join(articlesDir, file);
  const outDir = path.join(articlesDir, "pages", name);
  const manifest = path.join(outDir, "manifest.json");
  if (!force && (await mtime(manifest)) > (await mtime(src))) {
    console.log(`skip ${file} (up to date)`);
    continue;
  }
  await mkdir(outDir, { recursive: true });

  const data = new Uint8Array(await (await import("node:fs/promises")).readFile(src));
  const pdf = await getDocument({ data, isEvalSupported: false }).promise;
  const first = (await pdf.getPage(1)).getViewport({ scale: 1 });

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const base = page.getViewport({ scale: 1 });
    // Draw once at the largest size, then scale down for the smaller one.
    const largest = Math.max(...SIZES.map((s) => s.width));
    const viewport = page.getViewport({ scale: largest / base.width });
    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const png = await canvas.encode("png");
    for (const size of SIZES) {
      await sharp(png)
        .resize({ width: size.width })
        .webp({ quality: size.quality })
        .toFile(path.join(outDir, `${n}${size.suffix}.webp`));
    }
    page.cleanup();
  }

  await writeFile(
    manifest,
    JSON.stringify({ pages: pdf.numPages, width: first.width, height: first.height }) + "\n"
  );
  console.log(`rendered ${file}: ${pdf.numPages} pages`);
  await pdf.destroy();
}
