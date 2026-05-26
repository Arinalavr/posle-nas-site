import { ItemsGallery } from "@/components/items-gallery";
import { ScrollTopButton } from "@/components/scroll-top-button";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { items } from "@/lib/content";

export default function ItemsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader active="items" />

      <section className="border-y border-[var(--line)] bg-[var(--wash)] px-5 py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-brown)]">
              19 историй
            </p>
            <h1 className="mt-4 font-serif text-[42px] leading-[0.98] text-[var(--ink)] md:text-6xl md:leading-none">
              вещи, которые остались
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-[1.5] text-[var(--soft-ink)] md:text-[22px] md:leading-[1.45]">
              Маленькие следы чужих отъездов, из которых постепенно собирается
              новый дом.
            </p>
          </div>
        </div>
      </section>

      <ItemsGallery items={items} />
      <SiteFooter active="items" />
      <ScrollTopButton />
    </main>
  );
}
