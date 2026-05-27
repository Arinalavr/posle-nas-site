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
  const measurementRef = useRef<{
    height: number;
    top: number;
    viewportHeight: number;
  } | null>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const measureElement = () => {
      const element = ref.current;
      if (!element) {
        measurementRef.current = null;
        return null;
      }

      const rect = element.getBoundingClientRect();
      const measurement = {
        height: rect.height,
        top: rect.top + window.scrollY,
        viewportHeight: window.innerHeight,
      };

      measurementRef.current = measurement;
      return measurement;
    };

    const getTargetProgress = () => {
      const measurement = measurementRef.current ?? measureElement();
      if (!measurement) return 0;

      const viewportHeight = window.innerHeight;
      const start = window.scrollY + viewportHeight * startRatio;
      const distance =
        (measurement.height - startOffset - endOffset) * distanceMultiplier;
      return Math.min(
        1,
        Math.max(
          0,
          (start - measurement.top - startOffset) / Math.max(distance, 1),
        ),
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

    const measureAndUpdateProgress = () => {
      measureElement();
      updateProgress();
    };

    let measureFrame: number | null = null;
    const scheduleMeasureAndUpdate = () => {
      if (measureFrame !== null) {
        window.cancelAnimationFrame(measureFrame);
      }

      measureFrame = window.requestAnimationFrame(() => {
        measureFrame = null;
        measureAndUpdateProgress();
      });
    };

    const initialProgress = getTargetProgress();
    progressRef.current = initialProgress;
    targetProgressRef.current = initialProgress;
    setProgress(initialProgress);

    const element = ref.current;
    const contentRoot = element?.closest("section") ?? element;
    const images = Array.from(contentRoot?.querySelectorAll("img") ?? []);
    const delayedMeasures = [0, 160, 520, 1000].map((delay) =>
      window.setTimeout(scheduleMeasureAndUpdate, delay),
    );

    images.forEach((image) =>
      image.addEventListener("load", scheduleMeasureAndUpdate),
    );
    document.fonts?.ready.then(scheduleMeasureAndUpdate).catch(() => {});

    const rafId = window.requestAnimationFrame(scheduleMeasureAndUpdate);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", scheduleMeasureAndUpdate);
    window.addEventListener("load", scheduleMeasureAndUpdate);

    return () => {
      window.cancelAnimationFrame(rafId);
      delayedMeasures.forEach((timeoutId) => window.clearTimeout(timeoutId));

      if (measureFrame !== null) {
        window.cancelAnimationFrame(measureFrame);
        measureFrame = null;
      }

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      images.forEach((image) =>
        image.removeEventListener("load", scheduleMeasureAndUpdate),
      );
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", scheduleMeasureAndUpdate);
      window.removeEventListener("load", scheduleMeasureAndUpdate);
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

type ScrollLineClipOptions = Omit<ScrollProgressOptions, "smoothing"> & {
  viewBoxHeight?: number;
};

export function useScrollLineClip<
  TElement extends Element,
  TClip extends SVGRectElement,
>({
  startRatio = 0.66,
  distanceMultiplier = 1,
  endOffset = 0,
  startOffset = 0,
  viewBoxHeight = 3600,
}: ScrollLineClipOptions = {}) {
  const pathname = usePathname();
  const elementRef = useRef<TElement | null>(null);
  const clipRef = useRef<TClip | null>(null);
  const measurementRef = useRef<{
    height: number;
    top: number;
  } | null>(null);

  useEffect(() => {
    const setClipHeight = (progress: number) => {
      clipRef.current?.setAttribute(
        "height",
        String(Math.min(viewBoxHeight, Math.max(0, progress * viewBoxHeight))),
      );
    };

    const measureElement = () => {
      const element = elementRef.current;
      if (!element) {
        measurementRef.current = null;
        return null;
      }

      const rect = element.getBoundingClientRect();
      const measurement = {
        height: rect.height,
        top: rect.top + window.scrollY,
      };

      measurementRef.current = measurement;
      return measurement;
    };

    const getProgress = () => {
      const measurement = measurementRef.current ?? measureElement();
      if (!measurement) return 0;

      const start = window.scrollY + window.innerHeight * startRatio;
      const distance =
        (measurement.height - startOffset - endOffset) * distanceMultiplier;

      return Math.min(
        1,
        Math.max(
          0,
          (start - measurement.top - startOffset) / Math.max(distance, 1),
        ),
      );
    };

    const updateClip = () => {
      setClipHeight(getProgress());
    };

    let measureFrame: number | null = null;
    const scheduleMeasureAndUpdate = () => {
      if (measureFrame !== null) {
        window.cancelAnimationFrame(measureFrame);
      }

      measureFrame = window.requestAnimationFrame(() => {
        measureFrame = null;
        measureElement();
        updateClip();
      });
    };

    const element = elementRef.current;
    const contentRoot = element?.closest("section") ?? element;
    const images = Array.from(contentRoot?.querySelectorAll("img") ?? []);
    const delayedMeasures = [0, 160, 520, 1000].map((delay) =>
      window.setTimeout(scheduleMeasureAndUpdate, delay),
    );

    measureElement();
    updateClip();

    images.forEach((image) =>
      image.addEventListener("load", scheduleMeasureAndUpdate),
    );
    document.fonts?.ready.then(scheduleMeasureAndUpdate).catch(() => {});
    window.addEventListener("scroll", updateClip, { passive: true });
    window.addEventListener("resize", scheduleMeasureAndUpdate);
    window.addEventListener("load", scheduleMeasureAndUpdate);

    return () => {
      delayedMeasures.forEach((timeoutId) => window.clearTimeout(timeoutId));

      if (measureFrame !== null) {
        window.cancelAnimationFrame(measureFrame);
        measureFrame = null;
      }

      images.forEach((image) =>
        image.removeEventListener("load", scheduleMeasureAndUpdate),
      );
      window.removeEventListener("scroll", updateClip);
      window.removeEventListener("resize", scheduleMeasureAndUpdate);
      window.removeEventListener("load", scheduleMeasureAndUpdate);
    };
  }, [
    distanceMultiplier,
    endOffset,
    pathname,
    startOffset,
    startRatio,
    viewBoxHeight,
  ]);

  return [elementRef, clipRef] as const;
}
