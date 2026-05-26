import { ExhibitionFlow } from "@/components/exhibition-flow";
import { ScrollTopButton } from "@/components/scroll-top-button";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { exhibition, intro, items, quotes } from "@/lib/content";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader active="exhibition" />

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 pb-12 pt-2 md:grid-cols-12 md:px-10 md:pb-16 md:pt-4">
        <div className="min-w-0 md:col-span-6 md:col-start-1">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-brown)]">
            цифровая выставка
          </p>
          <div className="hero-logo-mark relative mt-4 h-[270px] w-full max-w-[420px] md:h-[390px] md:max-w-[560px]">
            <img
              src="/logo/posle-nas-mark.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-contain opacity-95"
            />
            <h1 className="absolute left-1/2 top-[49%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[46px] leading-none text-[var(--ink)] md:text-[64px]">
              после нас
            </h1>
          </div>
        </div>
        <div className="pt-0 md:col-span-6 md:col-start-7 md:pt-16">
          <div className="space-y-5 text-[18px] leading-[1.48] text-[var(--soft-ink)] md:text-[21px] md:leading-[1.42]">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--wash)] px-5 py-10 md:px-10 md:py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-brown)]">
              30 цитат / 19 вещей
            </p>
            <h2 className="mt-4 font-serif text-[42px] leading-[0.98] text-[var(--ink)] md:text-6xl md:leading-none">
              маршрут вещей и голосов
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-[var(--soft-ink)] md:text-right">
            Цитаты людей проведут вас через этот путь, а вещи останутся рядом:
            тихими следами домов, встреч и отъездов.
          </p>
        </div>
      </section>

      <ExhibitionFlow exhibition={exhibition} items={items} quotes={quotes} />
      <SiteFooter active="exhibition" />
      <ScrollTopButton />
    </main>
  );
}
