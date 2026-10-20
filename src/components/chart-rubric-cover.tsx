"use client";

import { useId } from "react";

import type { Article } from "@/lib/site-data";
import { useLanguage, useT } from "@/lib/language";

// Archive cover for an edition of the "A Chart Is Worth More Than a
// Thousand Words" rubrica, drawn as a newspaper front page: the rubrica's
// name as the masthead, the edition line under it, then the edition's
// illustration as the picture beside the article's title as the headline
// — on a small stack of sheets on plain navy. Every size is in container
// units (cqw), so the page scales as one picture with the card. Same
// aspect ratio as the Sway covers so the grid stays even.
const ease = "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

export function ChartRubricCover({
  article,
  rubric: { edition, illustration },
}: {
  article: Article;
  rubric: NonNullable<Article["chartRubric"]>;
}) {
  const t = useT();
  const { language } = useLanguage();
  const Illustration = illustrations[illustration];
  const issueDate = new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${article.date}T00:00:00`));

  return (
    <div className="@container relative aspect-[1080/1130] w-full overflow-hidden bg-brand-navy">
      {/* The sheets underneath: one cream, one paper. Positions are inline
          styles: the page is landscape, like a folded broadsheet. */}
      <div
        className={`absolute rotate-[2.5deg] bg-brand-cream group-hover:rotate-[3.5deg] ${ease}`}
        style={{ top: "13%", right: "3%", bottom: "23%", left: "10%" }}
      />
      <div
        className={`absolute -rotate-[1.5deg] border border-brand-navy/25 bg-[#f7f5ef] group-hover:-rotate-[2.5deg] ${ease}`}
        style={{ top: "15%", right: "8%", bottom: "20%", left: "3%" }}
      />
      {/* The front page: masthead, edition line, picture beside headline. */}
      <div
        style={{ top: "17%", right: "6%", bottom: "19%", left: "5%" }}
        className={`absolute flex flex-col border border-brand-navy/70 bg-[#fdfcf8] px-[4cqw] pt-[3.5cqw] pb-[3.5cqw] text-brand-navy group-hover:-translate-y-[1.2cqw] ${ease}`}
      >
        <div className="border-t-[0.5cqw] border-brand-navy" />
        <p className="mt-[1.6cqw] text-center font-heading text-[6.2cqw] leading-[1.05] font-bold text-balance">
          {t("rubric.chart.title", "A Chart Is Worth More Than a Thousand Words")}
        </p>
        <div className="mt-[1.6cqw] flex items-center justify-between border-y border-brand-navy/60 py-[0.9cqw] text-[2.1cqw] tracking-[0.12em] uppercase">
          <span>{t("rubric.chart.edition", "No. {n}", { n: edition })}</span>
          <span>Nova Finance Club</span>
          <span>{issueDate}</span>
        </div>

        <div className="mt-[3cqw] grid min-h-0 flex-1 grid-cols-[48%_1fr] gap-[3.5cqw]">
          <div className="relative overflow-hidden bg-brand-navy text-brand-cream">
            <Illustration />
          </div>
          <p className="line-clamp-6 self-center font-heading text-[6cqw] leading-[1.1] font-bold">
            {t(`article.${article.slug}.title`, article.title)}
          </p>
        </div>
        <div className="mt-[3cqw] border-t border-brand-navy/60" />
      </div>
    </div>
  );
}

// Flat drawings for the picture box, in cream (currentColor) on navy. Add
// one here for each new edition that needs a different subject.
function PiggyBank() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg
      viewBox="10 10 84 80"
      // Drawn larger than the box, so its edges crop the legs a little.
      style={{ position: "absolute", left: "-8%", top: "4%", width: "116%", height: "115%" }}
      aria-hidden
    >
      {/* Ear, tail, legs, body, snout. */}
      <path d="M33 47 L31 35 L43 42 Z" fill="currentColor" />
      <path d="M79 58 q9 -1 7 -10" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      <rect x={35} y={72} width={9} height={13} rx={2.5} fill="currentColor" />
      <rect x={62} y={72} width={9} height={13} rx={2.5} fill="currentColor" />
      <ellipse cx={53} cy={60} rx={28} ry={19} fill="currentColor" />
      <rect x={18} y={53} width={12} height={13} rx={4.5} fill="currentColor" />
      {/* Details in navy: snout edge, eye, belly shade. */}
      <line x1={30} y1={55} x2={30} y2={64} stroke="var(--brand-navy)" strokeOpacity={0.25} strokeWidth={1.2} />
      <circle cx={36} cy={55} r={2} fill="var(--brand-navy)" />
      <path d="M30 66 q23 15 50 -2" fill="none" stroke="var(--brand-navy)" strokeOpacity={0.12} strokeWidth={3} />
      {/* The coin, in front of the body with a navy rim so it stays
          distinct from the pig. On hover (or tap) it drops halfway into the
          slot: clipped at the slot's line, with the slot drawn over its
          lower edge, so its bottom half is hidden inside the pig. It rises
          back out when the pointer leaves. */}
      <clipPath id={`${id}-above-slot`}>
        <rect x={0} y={0} width={100} height={45} />
      </clipPath>
      <g clipPath={`url(#${id}-above-slot)`}>
        <g className="transition-transform duration-500 ease-in group-hover:translate-y-[22px] motion-reduce:transition-none">
          <circle cx={53} cy={22} r={8} fill="currentColor" stroke="var(--brand-navy)" strokeWidth={1.3} />
          <circle cx={53} cy={22} r={5} fill="none" stroke="var(--brand-navy)" strokeOpacity={0.35} strokeWidth={1.2} />
        </g>
      </g>
      <line x1={43} y1={45} x2={63} y2={45} stroke="var(--brand-navy)" strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  );
}

const illustrations = { "piggy-bank": PiggyBank } as const;
export type ChartRubricIllustration = keyof typeof illustrations;
