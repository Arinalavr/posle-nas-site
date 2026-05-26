"use client";

import { useId, useMemo } from "react";
import { getCardPhotoSizeClass, type Item } from "@/lib/content";
import {
  useElementScrollProgress,
  useScrollReveal,
} from "@/components/use-scroll-reveal";

type ItemsGalleryProps = {
  items: Item[];
};

export function ItemsGallery({ items }: ItemsGalleryProps) {
  const threadClipId = `items-route-${useId().replace(/:/g, "")}`;
  const [threadRef, threadProgress] = useElementScrollProgress<SVGSVGElement>({
    startRatio: 0.66,
    smoothing: 0.28,
  });
  useScrollReveal({ rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

  const orderedItems = useMemo(
    () => [...items].sort((first, second) => first.order - second.order),
    [items],
  );
  const lineClipHeight = Math.min(3600, Math.max(0, threadProgress * 3600));

  return (
    <section className="items-thread relative mx-auto max-w-7xl px-5 pb-16 pt-4 md:px-10 md:pb-28 md:pt-8">
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
        <path
          className="exhibition-route-drawn"
          d="M214 0 C128 176 302 276 198 430 C90 592 314 714 218 880 C112 1060 300 1170 190 1350 C75 1538 326 1648 214 1830 C98 2018 306 2162 188 2360 C88 2528 332 2686 212 2860 C110 3008 306 3182 202 3380 C176 3430 160 3494 174 3600"
          fill="none"
          stroke="rgba(199, 140, 123, 0.42)"
          strokeLinecap="round"
          strokeWidth="2"
          clipPath={`url(#${threadClipId})`}
        />
      </svg>
      {orderedItems.map((item, index) => {
        const isReversed = index % 2 === 1;

        return (
          <article
            className="scroll-reveal item-story-row relative grid grid-cols-1 items-center gap-y-7 border-t border-[var(--line)] py-12 first:border-t-0 md:min-h-[520px] md:grid-cols-12 md:gap-x-10 md:py-16"
            key={item.id}
            data-reversed={isReversed}
            style={{ transitionDelay: `${Math.min(index % 3, 2) * 70}ms` }}
          >
            <span
              className="item-row-marker absolute left-1/2 top-16 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--clay)] md:block"
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
                {item.title}
              </h2>
              <p className="mt-5 text-[18px] leading-[1.55] text-[var(--soft-ink)] md:mt-7 md:text-[20px]">
                {item.story}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
