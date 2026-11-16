import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";

// Set at build time; the site is a static export.
const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink pb-24 text-white/80 lg:pb-0">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/kenjax-logo-white.svg"
            alt="Kenjax Courier"
            width={381}
            height={105}
            className="h-12 w-auto"
          />
          <p className="mt-5 max-w-sm">
            Same-day medical and Rx courier for Los Angeles, Orange and Ventura
            counties. Open Monday to Friday, 9am to 6pm. Weekend hours vary.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-medium text-white">Services</h2>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quote" className="hover:text-white">
                Inquire about a quote
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-medium text-white">Reach us</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={site.phoneHref} className="tabular-nums hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.mapsUrl} className="hover:text-white" target="_blank" rel="noopener noreferrer">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postal}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-6xl px-5 py-5 text-sm text-white/60 sm:px-8">
          © {year} Kenjax Courier. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
