"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 420);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`scroll-top-button fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center border border-[var(--line)] bg-[var(--paper)] text-[var(--brown)] shadow-[0_18px_48px_rgba(67,49,37,0.14)] md:bottom-8 md:right-8 md:h-12 md:w-12 ${
        isVisible ? "is-visible" : ""
      }`}
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
