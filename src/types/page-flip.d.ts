// page-flip ships no type declarations; this covers the part of its API
// the PDF flipbook uses (components/pdf-flipbook.tsx).
declare module "page-flip/dist/js/page-flip.module.js" {
  export type FlipOrientation = "portrait" | "landscape";

  export interface FlipSettings {
    width: number;
    height: number;
    size: "fixed" | "stretch";
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    showCover: boolean;
    usePortrait: boolean;
    drawShadow: boolean;
    maxShadowOpacity: number;
    flippingTime: number;
    mobileScrollSupport: boolean;
    showPageCorners: boolean;
    autoSize: boolean;
    startPage: number;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Partial<FlipSettings>);
    loadFromHTML(items: HTMLElement[]): void;
    on(event: "flip", callback: (e: { data: number }) => void): this;
    on(event: "changeOrientation", callback: (e: { data: FlipOrientation }) => void): this;
    on(event: "init", callback: (e: { data: { page: number; mode: FlipOrientation } }) => void): this;
    flipNext(): void;
    flipPrev(): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): FlipOrientation;
    destroy(): void;
  }
}
