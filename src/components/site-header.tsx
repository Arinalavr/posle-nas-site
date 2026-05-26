import Link from "next/link";

type SiteHeaderProps = {
  active: "exhibition" | "items";
};

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`nav-link ${active ? "nav-link-active" : ""}`}>
      {children}
    </Link>
  );
}

function InstagramLink() {
  return (
    <a
      href="https://www.instagram.com/after_us.mne/"
      target="_blank"
      rel="noreferrer"
      className="nav-link inline-flex items-center gap-2"
      aria-label="Instagram after_us.mne"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
      </svg>
      <span>after_us.mne</span>
    </a>
  );
}

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col items-start gap-5 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-10 md:py-7">
      <Link href="/" className="inline-flex items-center gap-4 text-[var(--brown)] md:gap-5">
        <img
          src="/logo/posle-nas-mark.svg"
          alt=""
          className="h-12 w-12 object-contain opacity-95 md:h-16 md:w-16"
        />
        <span className="font-serif text-[32px] leading-none text-[var(--ink)] md:text-[38px]">
          после нас
        </span>
      </Link>
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-[var(--brown)] md:gap-8 md:text-sm md:tracking-[0.2em]">
        <NavLink href="/" active={active === "exhibition"}>
          выставка
        </NavLink>
        <NavLink href="/items" active={active === "items"}>
          вещи
        </NavLink>
        <InstagramLink />
      </nav>
    </header>
  );
}

export function SiteFooter({ active }: SiteHeaderProps) {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--wash)]/45">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-5 px-5 py-7 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
        <Link
          href="/"
          className="inline-flex items-center gap-4 text-[var(--brown)] md:gap-5"
        >
          <img
            src="/logo/posle-nas-mark.svg"
            alt=""
            className="h-11 w-11 object-contain opacity-95 md:h-14 md:w-14"
          />
          <span className="font-serif text-[30px] leading-none text-[var(--ink)] md:text-[34px]">
            после нас
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-[var(--brown)] md:gap-8 md:text-sm md:tracking-[0.2em]">
          <NavLink href="/" active={active === "exhibition"}>
            выставка
          </NavLink>
          <NavLink href="/items" active={active === "items"}>
            вещи
          </NavLink>
          <InstagramLink />
        </nav>
      </div>
    </footer>
  );
}
