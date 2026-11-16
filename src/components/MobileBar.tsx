import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/lib/site";

export default function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[2fr_3fr] gap-2 border-t border-line bg-white p-3 lg:hidden">
      <a
        href={site.phoneHref}
        className="flex items-center justify-center gap-2 rounded-md py-3 font-semibold ring-1 ring-inset ring-line"
      >
        <Phone className="size-4" aria-hidden />
        Call now
      </a>
      <Link
        href="/quote"
        className="flex items-center justify-center rounded-md bg-signal py-3 font-semibold text-white"
      >
        Inquire about a quote
      </Link>
    </div>
  );
}
