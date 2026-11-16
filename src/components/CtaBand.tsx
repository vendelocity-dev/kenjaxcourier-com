import Link from "next/link";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export default function CtaBand({
  title = "Something needs to move today?",
  text = "Dispatch is open Monday to Friday, 9am to 6pm. Weekend hours vary.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-ink text-white">
      <Container className="grid gap-8 py-16 sm:py-20 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div>
          <h2 className="font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-white/75">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <a
            href={site.phoneHref}
            className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-5 font-semibold text-ink hover:bg-ice"
          >
            <Phone className="size-4" aria-hidden />
            <span className="tabular-nums">{site.phone}</span>
          </a>
          <Link
            href="/quote"
            className="inline-flex h-12 items-center rounded-md bg-signal px-5 font-semibold text-white hover:bg-signal-dark"
          >
            Inquire about a quote
          </Link>
        </div>
      </Container>
    </section>
  );
}
