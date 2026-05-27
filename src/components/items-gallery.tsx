"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  getCardPhotoSizeClass,
  itemDimensions,
  type Item,
} from "@/lib/content";
import {
  useElementScrollProgress,
  useScrollReveal,
} from "@/components/use-scroll-reveal";

type ItemsGalleryProps = {
  items: Item[];
};

const DEFAULT_THREAD_PATH =
  "M210 0 C210 180 258 360 258 540 C258 720 210 900 210 1080 C210 1260 162 1440 162 1620 C162 1800 210 1980 210 2160 C210 2340 258 2520 258 2700 C258 2880 210 3060 210 3240 C210 3360 184 3480 210 3600";

function buildThreadPath(markerYPoints: number[]) {
  const points = Array.from(new Set([0, ...markerYPoints, 3600]))
    .filter((point) => point >= 0 && point <= 3600)
    .sort((first, second) => first - second);

  if (points.length < 2) return DEFAULT_THREAD_PATH;

  let path = `M210 ${points[0].toFixed(1)}`;

  for (let index = 1; index < points.length; index += 1) {
    const previousY = points[index - 1];
    const nextY = points[index];
    const distance = nextY - previousY;

    if (distance <= 0) continue;

    if (distance < 120) {
      path += ` L210 ${nextY.toFixed(1)}`;
      continue;
    }

    const bend = Math.min(38, Math.max(16, distance * 0.18));
    const direction = index % 2 === 0 ? -1 : 1;
    const middleY = previousY + distance / 2;
    const middleX = 210 + bend * direction;

    path += ` C210 ${(previousY + distance * 0.2).toFixed(1)} ${middleX.toFixed(1)} ${(middleY - distance * 0.22).toFixed(1)} ${middleX.toFixed(1)} ${middleY.toFixed(1)}`;
    path += ` C${middleX.toFixed(1)} ${(middleY + distance * 0.22).toFixed(1)} 210 ${(nextY - distance * 0.2).toFixed(1)} 210 ${nextY.toFixed(1)}`;
  }

  return path;
}

export function ItemsGallery({ items }: ItemsGalleryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const threadClipId = `items-route-${useId().replace(/:/g, "")}`;
  const [threadRef, threadProgress] = useElementScrollProgress<SVGSVGElement>({
    startRatio: 0.66,
    smoothing: 0.28,
  });
  const [threadPath, setThreadPath] = useState<string | null>(null);
  useScrollReveal({ rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

  const orderedItems = useMemo(
    () => [...items].sort((first, second) => first.order - second.order),
    [items],
  );
  const lineClipHeight = Math.min(3600, Math.max(0, threadProgress * 3600));

  useLayoutEffect(() => {
    const updateThreadPath = () => {
      const section = sectionRef.current;
      const svg = threadRef.current;

      if (!section || !svg) return;

      const svgElement = svg as unknown as HTMLElement;
      const sectionRect = section.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const svgTopInSection = svgRect.top - sectionRect.top;
      const markers = Array.from(
        section.querySelectorAll<HTMLElement>(".item-row-marker"),
      );

      if (svgElement.clientHeight <= 0 || markers.length === 0) {
        setThreadPath(DEFAULT_THREAD_PATH);
        return;
      }

      const markerYPoints = markers.flatMap((marker) => {
        const row = marker.closest<HTMLElement>(".item-story-row");

        if (!row) return [];

        const markerCenterY =
          row.offsetTop + marker.offsetTop + marker.offsetHeight / 2;
        const relativeY =
          ((markerCenterY - svgTopInSection) / svgElement.clientHeight) *
          3600;

        return [Math.min(3600, Math.max(0, relativeY))];
      });

      const nextPath = buildThreadPath(markerYPoints);
      setThreadPath((currentPath) =>
        currentPath === nextPath ? currentPath : nextPath,
      );
    };

    let animationFrame: number | null = null;
    const scheduleUpdate = () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        updateThreadPath();
      });
    };

    const delayedUpdates = [0, 180, 520, 1000].map((delay) =>
      window.setTimeout(scheduleUpdate, delay),
    );
    const images = Array.from(
      sectionRef.current?.querySelectorAll<HTMLImageElement>("img") ?? [],
    );

    images.forEach((image) => image.addEventListener("load", scheduleUpdate));
    document.fonts?.ready.then(scheduleUpdate).catch(() => {});
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("load", scheduleUpdate);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      delayedUpdates.forEach((timeoutId) => window.clearTimeout(timeoutId));
      images.forEach((image) =>
        image.removeEventListener("load", scheduleUpdate),
      );
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("load", scheduleUpdate);
    };
  }, [orderedItems.length, threadRef]);

  return (
    <section
      className="items-thread relative mx-auto max-w-7xl px-5 pb-16 pt-4 md:px-10 md:pb-28 md:pt-8"
      ref={sectionRef}
    >
      <svg
        className="pointer-events-none absolute left-1/2 top-8 hidden h-[calc(100%-10rem)] w-[18rem] -translate-x-1/2 text-[var(--line-path)] md:block"
        viewBox="0 0 420 3600"
        preserveAspectRatio="none"
        aria-hidden="true"
        ref={threadRef}
      >
        <defs>
          <clipPath id={threadClipId} clipPathUnits="userSpaceOnUse">
            <rect x="0" y="0" width="420" height={lineClipHeight} />
          </clipPath>
        </defs>
        {threadPath ? (
          <path
            className="exhibition-route-drawn"
            d={threadPath}
            fill="none"
            stroke="rgba(199, 140, 123, 0.42)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            clipPath={`url(#${threadClipId})`}
          />
        ) : null}
      </svg>
      {orderedItems.map((item, index) => {
        const isReversed = index % 2 === 1;
        const dimensions = itemDimensions[item.id];

        return (
          <article
            className="scroll-reveal item-story-row relative grid grid-cols-1 items-center gap-y-7 border-t border-[var(--line)] py-12 first:border-t-0 md:min-h-[520px] md:grid-cols-12 md:gap-x-10 md:py-16"
            key={item.id}
            data-reversed={isReversed}
            style={{ transitionDelay: `${Math.min(index % 3, 2) * 70}ms` }}
          >
            <span
              className="item-row-marker absolute left-1/2 top-16 hidden h-3 w-3 rounded-full bg-[var(--clay)] md:block"
              aria-hidden="true"
            />
            <div
              className={`item-photo-panel photo-piece non-clickable-photo group text-left md:row-start-1 ${
                isReversed
                  ? "md:col-start-8 md:col-span-5 md:justify-self-end"
                  : "md:col-start-1 md:col-span-5 md:justify-self-start"
              }`}
            >
              <span
                className={`block w-full ${getCardPhotoSizeClass(item.id)} overflow-hidden border border-[var(--line)] bg-[var(--paper)] shadow-[0_24px_72px_rgba(67,49,37,0.10)]`}
              >
                <img
                  src={item.photo}
                  alt={item.photo_alt}
                  width={dimensions?.width}
                  height={dimensions?.height}
                  className="block h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]"
                  loading="lazy"
                />
              </span>
            </div>

            <div
              className={`item-copy ${
                isReversed
                  ? "md:col-start-2 md:col-span-5 md:row-start-1"
                  : "md:col-start-7 md:col-span-5 md:row-start-1"
              }`}
            >
              <h2 className="font-serif text-[40px] leading-[0.98] text-[var(--ink)] md:text-[54px] md:leading-[0.96]">
                <span className="item-title-mask">{item.title}</span>
              </h2>
              <p className="mt-5 text-[18px] leading-[1.55] text-[var(--soft-ink)] md:mt-7 md:text-[20px]">
                <span className="item-text-mask">{item.story}</span>
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
