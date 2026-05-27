"use client";

import { useId, useState } from "react";
import {
  arcLabels,
  getPhotoSizeClass,
  itemDimensions,
  type ExhibitionEntry,
  type Item,
  type Quote,
} from "@/lib/content";
import { ItemModal } from "@/components/item-modal";
import {
  useScrollLineClip,
  useScrollReveal,
} from "@/components/use-scroll-reveal";

type ExhibitionFlowProps = {
  exhibition: ExhibitionEntry[];
  items: Item[];
  quotes: Quote[];
};

const quoteLayouts = [
  "md:col-start-2 md:col-span-5",
  "md:col-start-6 md:col-span-5",
  "md:col-start-3 md:col-span-5",
  "md:col-start-1 md:col-span-4",
  "md:col-start-7 md:col-span-4",
];

const itemLayouts = [
  "md:col-start-8 md:col-span-3",
  "md:col-start-2 md:col-span-4",
  "md:col-start-7 md:col-span-3",
  "md:col-start-4 md:col-span-3",
  "md:col-start-9 md:col-span-3",
  "md:col-start-1 md:col-span-3",
];

function QuoteBlock({ quote, index }: { quote: Quote; index: number }) {
  return (
    <figure
      className={`${quoteLayouts[index % quoteLayouts.length]} exhibition-piece quote-piece scroll-reveal`}
      style={{ transitionDelay: `${Math.min(index % 4, 3) * 55}ms` }}
    >
      <figcaption className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[var(--muted-brown)]">
        <span className="quote-label-mask">{arcLabels[quote.arc]}</span>
      </figcaption>
      <blockquote className="font-serif text-[24px] leading-[1.2] text-[var(--ink)] md:text-[28px] md:leading-[1.16]">
        <span className="quote-text-mask">«{quote.text}»</span>
      </blockquote>
    </figure>
  );
}

function PhotoTile({
  item,
  index,
  onOpen,
}: {
  item: Item;
  index: number;
  onOpen: (item: Item) => void;
}) {
  const dimensions = itemDimensions[item.id];

  return (
    <button
      className={`${itemLayouts[index % itemLayouts.length]} exhibition-piece photo-piece group scroll-reveal justify-self-center text-left md:justify-self-auto`}
      type="button"
      aria-label={`Открыть историю: ${item.title}`}
      onClick={() => onOpen(item)}
      style={{ transitionDelay: `${Math.min(index % 4, 3) * 65}ms` }}
    >
      <span
        className={`block w-full ${getPhotoSizeClass(item.id)} overflow-hidden border border-[var(--line)] bg-[var(--paper)] shadow-[0_22px_62px_rgba(67,49,37,0.10)]`}
      >
        <img
          src={item.photo}
          alt={item.photo_alt}
          width={dimensions?.width}
          height={dimensions?.height}
          className="block h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]"
          loading="lazy"
        />
        <span className="block border-t border-[var(--line)] bg-[var(--paper)] p-4">
          <span className="block font-serif text-[23px] leading-none text-[var(--brown)] md:text-[25px]">
            {item.title}
          </span>
          <span className="photo-cta mt-3 inline-flex border-b border-[var(--brown)] pb-1 text-xs text-[var(--brown)] opacity-75 group-hover:opacity-100">
            открыть историю
          </span>
        </span>
      </span>
    </button>
  );
}

export function ExhibitionFlow({
  exhibition,
  items,
  quotes,
}: ExhibitionFlowProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const routeClipId = `route-${useId().replace(/:/g, "")}`;
  const [routeRef, routeClipRef] = useScrollLineClip<
    SVGSVGElement,
    SVGRectElement
  >({
    startRatio: 0.66,
  });
  useScrollReveal();

  const quoteMap = new Map(quotes.map((quote) => [quote.id, quote]));
  const itemMap = new Map(items.map((item) => [item.id, item]));
  let quoteIndex = 0;
  let itemIndex = 0;

  return (
    <>
      <section
        className="exhibition-grid relative mx-auto grid max-w-7xl grid-cols-1 gap-y-10 px-5 py-12 md:grid-cols-12 md:gap-x-8 md:gap-y-12 md:px-10 md:py-20"
      >
        <svg
          className="pointer-events-none absolute left-[54%] top-10 hidden h-[calc(100%-5rem)] w-[25rem] -translate-x-1/2 text-[var(--line-path)] md:block"
          viewBox="0 0 420 3600"
          preserveAspectRatio="none"
          aria-hidden="true"
          ref={routeRef}
        >
          <defs>
            <clipPath id={routeClipId} clipPathUnits="userSpaceOnUse">
              <rect ref={routeClipRef} x="0" y="0" width="420" height="0" />
            </clipPath>
          </defs>
          <path
            className="exhibition-route-drawn"
            d="M214 0 C160 150 142 286 198 430 C252 574 318 720 218 880 C118 1040 116 1195 190 1350 C264 1505 324 1672 214 1830 C104 1988 118 2170 188 2360 C258 2550 318 2700 212 2860 C106 3020 116 3200 202 3380 C288 3560 190 3530 174 3600"
            fill="none"
            stroke="rgba(199, 140, 123, 0.42)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            clipPath={`url(#${routeClipId})`}
          />
        </svg>
        {exhibition.map((entry) => {
          if (entry.type === "quote") {
            const quote = quoteMap.get(entry.id);
            if (!quote) return null;
            const currentIndex = quoteIndex++;
            return (
              <QuoteBlock
                key={entry.id}
                quote={quote}
                index={currentIndex}
              />
            );
          }

          const item = itemMap.get(entry.id);
          if (!item) return null;
          const currentIndex = itemIndex++;
          return (
            <PhotoTile
              key={entry.id}
              item={item}
              index={currentIndex}
              onOpen={setSelectedItem}
            />
          );
        })}
      </section>
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
