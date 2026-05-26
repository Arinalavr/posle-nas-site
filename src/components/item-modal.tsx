"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import type { Item } from "@/lib/content";

type ItemModalProps = {
  item: Item | null;
  onClose: () => void;
};

export function ItemModal({ item, onClose }: ItemModalProps) {
  useEffect(() => {
    if (!item) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d211b]/45 px-4 py-4 backdrop-blur-sm md:px-10 md:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-modal-title"
      onMouseDown={onClose}
    >
      <article
        className="grid max-h-[90vh] w-full max-w-5xl grid-cols-1 gap-5 overflow-auto border border-[var(--line)] bg-[var(--paper)] p-4 shadow-[0_38px_120px_rgba(45,33,27,0.32)] md:max-h-[88vh] md:grid-cols-[minmax(280px,0.92fr)_minmax(360px,1fr)] md:gap-8 md:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-0 items-center justify-center bg-[var(--wash)]/45 p-3 md:p-4">
          <img
            src={item.photo}
            alt={item.photo_alt}
            className="max-h-[42vh] w-auto max-w-full object-contain md:max-h-[72vh]"
          />
        </div>
        <div className="flex flex-col">
          <button
            type="button"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center border border-[var(--line)] text-[var(--brown)] transition-colors duration-300 hover:border-[var(--brown)] hover:bg-[var(--wash)]"
            aria-label="Закрыть карточку"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <h2
            id="item-modal-title"
            className="mt-5 font-serif text-[40px] leading-[0.98] text-[var(--ink)] md:mt-10 md:text-[52px] md:leading-[0.95]"
          >
            {item.title}
          </h2>
          <p className="mt-5 text-[18px] leading-[1.55] text-[var(--soft-ink)] md:mt-8 md:text-[20px]">
            {item.story}
          </p>
        </div>
      </article>
    </div>
  );
}
