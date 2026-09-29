"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  animate,
  type Variants,
} from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Applies `prefers-reduced-motion` globally to every `motion.*` component
 * below it. Deliberately the ONLY place that reacts to reduced motion for
 * transform-based animation: branching individual components' `initial` /
 * `whileHover` props on `useReducedMotion()` directly causes a real SSR vs.
 * client markup mismatch (the server can't know the OS setting, so it always
 * renders the animated state, while a reduced-motion client renders the
 * final state on first paint) — React then reports a hydration error.
 * `MotionConfig` avoids that: it neutralizes transforms after mount instead
 * of changing what gets server-rendered.
 */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Fades + lifts content into place once, as it enters the viewport.
 *
 * Pass `immediate` for content that's guaranteed visible on load (e.g. the
 * hero) instead of relying on `whileInView`: the trigger for `whileInView`
 * is the browser's IntersectionObserver, and its very first check on mount
 * doesn't reliably fire before an actual scroll event happens (reproduced
 * in testing — content already in the initial viewport stayed stuck at
 * `initial` until the page was scrolled). Content the user must scroll to
 * reach doesn't hit this, since reaching it requires a real scroll event.
 *
 * `amount: "some"` (any pixel intersecting), not a fraction like 0.3: a
 * fraction is the *portion of the target's own height* that must be
 * visible, which silently breaks for any block taller than roughly
 * 1/fraction × the viewport (reproduced: a 2800px-tall team grid on an
 * 844px mobile viewport never reached 30%, since even a full viewport of
 * it visible caps out right at that threshold — the block just stayed
 * invisible forever). "some" has no such ceiling.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
}) {
  const trigger = immediate
    ? { animate: { opacity: 1, y: 0 } }
    : {
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: "some" as const },
      };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      {...trigger}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * Wraps a group of `StaggerItem`s and cascades their entrance. Pass
 * `immediate` for content guaranteed visible on load — see `Reveal` above
 * for why `whileInView` alone isn't reliable for that case, and for why
 * `amount: "some"` rather than a fraction (a fraction breaks for any group
 * tall enough that a full viewport of it never reaches that fraction).
 */
export function StaggerGroup({
  children,
  className,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  immediate?: boolean;
}) {
  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, amount: "some" as const } };
  return (
    <motion.div
      className={className}
      initial="hidden"
      {...trigger}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/** Spring lift + press feedback for clickable cards and buttons. */
export function HoverLift({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counts up from 0 to `value` once it scrolls into view. The server-rendered
 * HTML always carries the real `value` — search engines, link previews and
 * visitors without JavaScript read "27 members", never "0 members". Only
 * after hydration, and only if the number hasn't been scrolled into view
 * yet, is it reset to 0 so the count-up can play when it arrives. Writes go
 * through `textContent` in effects (never the render return), so server and
 * first-client markup stay identical.
 */
export function AnimatedStat({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const primed = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  // On mount: park the number at 0, ready to count up.
  useEffect(() => {
    if (reduce || !ref.current) return;
    ref.current.textContent = `0${suffix}`;
    primed.current = true;
    // Mount-only on purpose: re-priming later would restart the count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView || !ref.current || !primed.current) return;
    if (reduce) {
      ref.current.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

/**
 * Types `text` out character by character on mount, then leaves a blinking
 * "_" cursor after it — a nod to the site's <code>-style branding. Renders
 * the full text up front (so there's real content without JS) and only
 * starts the reveal after mount, imperatively rewriting textContent rather
 * than driving it through render state — same reasoning as AnimatedStat
 * above: the effect runs after hydration, so there's nothing for React to
 * mismatch against. Skips straight to the full text under
 * prefers-reduced-motion; the cursor keeps blinking either way (a blinking
 * caret isn't the kind of motion that setting opts out of), via a plain CSS
 * keyframe rather than a spring/transform — see the `.animate-blink` rule
 * in globals.css.
 */
export function TypewriterTitle({
  text,
  speed = 55,
}: {
  text: string;
  /** Milliseconds per character. */
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reduce) return;
    ref.current.textContent = "";
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (ref.current) ref.current.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, reduce]);

  return (
    <>
      <span ref={ref}>{text}</span>
      <span className="animate-blink" aria-hidden="true">
        _
      </span>
    </>
  );
}

/** Subtle scroll parallax for the hero background image. */
export function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
