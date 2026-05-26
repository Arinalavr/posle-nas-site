"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ScrollRevealOptions = {
  rootMargin?: string;
  threshold?: number;
};

export function useScrollReveal({
  rootMargin = "0px 0px 18% 0px",
  threshold = 0.04,
}: ScrollRevealOptions = {}) {
  const pathname = usePathname();

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let rafId: number | null = null;

    const setupReveal = () => {
      const elements = Array.from(document.querySelectorAll(".scroll-reveal"));

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
          });
        },
        {
          rootMargin,
          threshold,
        },
      );

      elements.forEach((element) => observer?.observe(element));
    };

    rafId = window.requestAnimationFrame(setupReveal);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [pathname, rootMargin, threshold]);
}

type ScrollProgressOptions = {
  startRatio?: number;
  distanceMultiplier?: number;
  endOffset?: number;
  smoothing?: number;
  startOffset?: number;
};

export function useElementScrollProgress<T extends Element>({
  startRatio = 0.66,
  distanceMultiplier = 1,
  endOffset = 0,
  smoothing = 0.18,
  startOffset = 0,
}: ScrollProgressOptions = {}) {
  const pathname = usePathname();
  const ref = useRef<T | null>(null);
  const frameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getTargetProgress = () => {
      const element = ref.current;
      if (!element) return 0;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * startRatio;
      const distance =
        (rect.height - startOffset - endOffset) * distanceMultiplier;
      return Math.min(
        1,
        Math.max(0, (start - rect.top - startOffset) / Math.max(distance, 1)),
      );
    };

    const animateProgress = () => {
      const current = progressRef.current;
      const target = targetProgressRef.current;
      const next =
        Math.abs(target - current) < 0.001
          ? target
          : current + (target - current) * smoothing;

      progressRef.current = next;
      setProgress(next);

      if (next === target) {
        frameRef.current = null;
        return;
      }

      frameRef.current = window.requestAnimationFrame(animateProgress);
    };

    const updateProgress = () => {
      targetProgressRef.current = getTargetProgress();

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(animateProgress);
      }
    };

    const initialProgress = getTargetProgress();
    progressRef.current = initialProgress;
    targetProgressRef.current = initialProgress;
    setProgress(initialProgress);

    const rafId = window.requestAnimationFrame(updateProgress);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.cancelAnimationFrame(rafId);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [
    distanceMultiplier,
    endOffset,
    pathname,
    smoothing,
    startOffset,
    startRatio,
  ]);

  return [ref, progress] as const;
}
