"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import type { FundSeriesPoint } from "@/lib/fund-performance";
import { formatDate, formatPercent } from "@/lib/fund-format";
import { useLanguage, useT } from "@/lib/language";

// Cumulative return since inception, fund vs benchmark, on one axis (both are
// returns over the same dates, so they share a scale). The fund is the solid
// ink line; the benchmark is gold and dashed, so the two never rely on colour
// alone. Hover or arrow keys move a crosshair; a table view sits underneath.

type Point = { date: string; fund: number | null; benchmark: number | null };

const MARGIN = { top: 16, bottom: 30 };
const LABEL_SPACE = 132; // room for the end-of-line labels on wide charts

function niceStep(span: number, target: number) {
  const raw = span / target;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const residual = raw / magnitude;
  const nice = residual >= 5 ? 10 : residual >= 2 ? 5 : residual >= 1 ? 2 : 1;
  return nice * magnitude;
}

function toReturn(value: number | null) {
  return value == null ? null : value / 100 - 1;
}

export function FundPerformanceChart({
  series,
  benchmarkName,
}: {
  series: FundSeriesPoint[];
  benchmarkName: string | null;
}) {
  const t = useT();
  const { language } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Start narrow: the first paint must never be wider than a phone screen,
  // or it would stretch its container before the real width is measured.
  const [width, setWidth] = useState(320);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const points: Point[] = useMemo(
    () => series.map((p) => ({ date: p.date, fund: toReturn(p.fund), benchmark: toReturn(p.benchmark) })),
    [series]
  );
  const hasBenchmark = benchmarkName != null && points.some((p) => p.benchmark != null);
  const fundLabel = t("fund.chart.fund", "NFC Fund");

  const compact = width < 520;
  const HEIGHT = compact ? 230 : 300;
  const left = compact ? 40 : 56;
  const endLabels = !compact;
  const right = endLabels ? LABEL_SPACE : 16;
  const plotWidth = width - left - right;
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

  const values = points.flatMap((p) => [p.fund, hasBenchmark ? p.benchmark : null]).filter((v): v is number => v != null);
  let low = Math.min(0, ...values);
  let high = Math.max(0, ...values);
  if (high - low < 0.01) {
    low -= 0.005;
    high += 0.005;
  }
  const step = niceStep(high - low, 4);
  const yMin = Math.floor(low / step) * step;
  const yMax = Math.ceil(high / step) * step;
  const yTicks: number[] = [];
  for (let v = yMin; v <= yMax + step / 2; v += step) yTicks.push(Number(v.toFixed(10)));

  const x = (i: number) => left + (points.length === 1 ? plotWidth / 2 : (i / (points.length - 1)) * plotWidth);
  const y = (v: number) => MARGIN.top + ((yMax - v) / (yMax - yMin)) * plotHeight;

  const path = (key: "fund" | "benchmark") => {
    let d = "";
    let pen = false;
    points.forEach((p, i) => {
      const v = p[key];
      if (v == null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  const tickCount = Math.min(points.length, width < 520 ? 3 : 5);
  const xTicks = Array.from(new Set(
    Array.from({ length: tickCount }, (_, k) => Math.round((k / Math.max(1, tickCount - 1)) * (points.length - 1)))
  ));

  // End labels: last value of each line, nudged apart if they collide.
  const last = points.length - 1;
  const lastFund = points[last]?.fund ?? null;
  const lastBench = hasBenchmark ? points[last]?.benchmark ?? null : null;
  let fundLabelY = lastFund != null ? y(lastFund) : 0;
  let benchLabelY = lastBench != null ? y(lastBench) : 0;
  if (lastFund != null && lastBench != null && Math.abs(fundLabelY - benchLabelY) < 30) {
    const mid = (fundLabelY + benchLabelY) / 2;
    const fundAbove = fundLabelY <= benchLabelY;
    fundLabelY = mid + (fundAbove ? -15 : 15);
    benchLabelY = mid + (fundAbove ? 15 : -15);
  }

  const indexFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * width;
    const ratio = (px - left) / plotWidth;
    return Math.min(last, Math.max(0, Math.round(ratio * last)));
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const current = active ?? last;
    const next =
      event.key === "ArrowLeft" ? current - 1
      : event.key === "ArrowRight" ? current + 1
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next == null) return;
    event.preventDefault();
    setActive(Math.min(last, Math.max(0, next)));
  };

  const activePoint = active != null ? points[active] : null;
  const tooltipLeft = active != null ? x(active) : 0;
  const tooltipOnLeft = tooltipLeft > width * 0.6;

  const summary = t(
    "fund.chart.summary",
    "Cumulative return since inception: {fundName} {fund}{benchmarkPart}, from {start} to {end}.",
    {
      fundName: fundLabel,
      fund: formatPercent(lastFund, language),
      benchmarkPart: lastBench != null ? `, ${benchmarkName} ${formatPercent(lastBench, language)}` : "",
      start: formatDate(points[0].date, language),
      end: formatDate(points[last].date, language),
    }
  );

  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/70">
        <li className="flex items-center gap-2">
          <svg width="22" height="8" aria-hidden="true">
            <line x1="1" y1="4" x2="21" y2="4" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {fundLabel}
        </li>
        {hasBenchmark && (
          <li className="flex items-center gap-2">
            <svg width="22" height="8" aria-hidden="true">
              <line x1="1" y1="4" x2="21" y2="4" className="stroke-chart-benchmark" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round" />
            </svg>
            {t("fund.chart.benchmarkLegend", "{benchmark}, in euros", { benchmark: benchmarkName ?? "" })}
          </li>
        )}
      </ul>

      <div ref={wrapperRef} className="relative w-full min-w-0">
        <svg
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          role="img"
          aria-label={summary}
          tabIndex={0}
          className="block touch-pan-y overflow-visible rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          onPointerMove={(event) => setActive(indexFromPointer(event))}
          onPointerDown={(event) => setActive(indexFromPointer(event))}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={left}
                x2={left + plotWidth}
                y1={y(tick)}
                y2={y(tick)}
                className={tick === 0 ? "stroke-foreground/35" : "stroke-foreground/10"}
                strokeWidth="1"
              />
              <text x={left - 10} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-foreground/55 text-[11px] tabular-nums">
                {formatPercent(tick, language, { digits: step < 0.01 ? 1 : 0 })}
              </text>
            </g>
          ))}

          {xTicks.map((i) => (
            <text
              key={i}
              x={x(i)}
              y={HEIGHT - 8}
              textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"}
              className="fill-foreground/55 text-[11px]"
            >
              {formatDate(points[i].date, language, { short: true })}
            </text>
          ))}

          {hasBenchmark && (
            <path d={path("benchmark")} fill="none" className="stroke-chart-benchmark" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />
          )}
          <path d={path("fund")} fill="none" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {activePoint == null && (
            <>
              {lastBench != null && (
                <circle cx={x(last)} cy={y(lastBench)} r="4" className="fill-chart-benchmark stroke-background" strokeWidth="2" />
              )}
              {lastFund != null && (
                <circle cx={x(last)} cy={y(lastFund)} r="4" className="fill-foreground stroke-background" strokeWidth="2" />
              )}
            </>
          )}

          {endLabels && (
            <g className="text-[12px]">
              {lastFund != null && (
                <text x={x(last) + 12} y={fundLabelY} dy="0.32em">
                  <tspan className="fill-foreground font-semibold tabular-nums">{formatPercent(lastFund, language)}</tspan>
                  <tspan className="fill-foreground/60"> {fundLabel}</tspan>
                </text>
              )}
              {lastBench != null && (
                <text x={x(last) + 12} y={benchLabelY} dy="0.32em">
                  <tspan className="fill-foreground font-semibold tabular-nums">{formatPercent(lastBench, language)}</tspan>
                  <tspan className="fill-foreground/60"> {benchmarkName}</tspan>
                </text>
              )}
            </g>
          )}

          {activePoint && active != null && (
            <g pointerEvents="none">
              <line x1={x(active)} x2={x(active)} y1={MARGIN.top} y2={MARGIN.top + plotHeight} className="stroke-foreground/30" strokeWidth="1" />
              {hasBenchmark && activePoint.benchmark != null && (
                <circle cx={x(active)} cy={y(activePoint.benchmark)} r="4" className="fill-chart-benchmark stroke-background" strokeWidth="2" />
              )}
              {activePoint.fund != null && (
                <circle cx={x(active)} cy={y(activePoint.fund)} r="4" className="fill-foreground stroke-background" strokeWidth="2" />
              )}
            </g>
          )}
        </svg>

        {activePoint && active != null && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-44 rounded-md border bg-background px-3 py-2 text-xs shadow-sm"
            style={tooltipOnLeft ? { right: width - tooltipLeft + 12 } : { left: tooltipLeft + 12 }}
            aria-hidden="true"
          >
            <p className="mb-1.5 font-semibold">{formatDate(activePoint.date, language)}</p>
            <p className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-foreground/70">
                <span className="inline-block h-0.5 w-3 rounded-full bg-foreground" />
                {fundLabel}
              </span>
              <span className="font-semibold tabular-nums">{formatPercent(activePoint.fund, language)}</span>
            </p>
            {hasBenchmark && (
              <p className="mt-1 flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-foreground/70">
                  <span className="inline-block h-0.5 w-3 rounded-full bg-chart-benchmark" />
                  {benchmarkName}
                </span>
                <span className="font-semibold tabular-nums">{formatPercent(activePoint.benchmark, language)}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-foreground/60 hover:text-foreground">
          {t("fund.chart.tableToggle", "View as table")}
        </summary>
        <div className="mt-3 max-h-72 overflow-auto rounded-lg border">
          <table className="w-full text-left tabular-nums">
            <thead className="sticky top-0 bg-background text-xs text-foreground/60">
              <tr>
                <th className="px-4 py-2 font-medium">{t("fund.chart.date", "Date")}</th>
                <th className="px-4 py-2 text-right font-medium">{fundLabel}</th>
                {hasBenchmark && <th className="px-4 py-2 text-right font-medium">{benchmarkName}</th>}
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map((p) => (
                <tr key={p.date} className="border-t">
                  <td className="px-4 py-2">{formatDate(p.date, language)}</td>
                  <td className="px-4 py-2 text-right">{formatPercent(p.fund, language)}</td>
                  {hasBenchmark && <td className="px-4 py-2 text-right">{formatPercent(p.benchmark, language)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
