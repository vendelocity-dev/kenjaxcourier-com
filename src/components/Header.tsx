"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import OpenStatus from "@/components/OpenStatus";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-ink text-white/85">
        <p className="mx-auto flex w-full max-w-6xl items-center gap-2.5 px-5 py-2 text-sm sm:px-8">
          <OpenStatus />
          <a href={site.phoneHref} className="ml-auto whitespace-nowrap font-semibold tabular-nums text-white hover:underline xl:hidden">
            {site.phone}
          </a>
        </p>
      </div>
      <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Kenjax Courier home">
          <Image
            src="/kenjax-logo.svg"
            alt="Kenjax Courier"
            width={381}
            height={105}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 whitespace-nowrap text-[0.95rem] font-medium xl:gap-7">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`py-2 transition-colors hover:text-signal ${
                      active ? "text-signal" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 whitespace-nowrap font-semibold tabular-nums hover:text-signal xl:flex"
          >
            <Phone className="size-4" aria-hidden />
            {site.phone}
          </a>
          <Link
            href="/quote"
            className="inline-flex h-11 items-center whitespace-nowrap rounded-md bg-signal px-4 font-semibold text-white hover:bg-signal-dark"
          >
            Inquire about a quote
          </Link>
        </div>

        <button
          type="button"
          className="-mr-2 rounded-md p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-line bg-white lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-5 py-3 sm:px-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 text-lg font-medium"
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
