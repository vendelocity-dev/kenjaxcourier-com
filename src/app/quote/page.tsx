import type { Metadata } from "next";
import { Suspense } from "react";
import { Phone } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Inquire about a quote",
  description:
    "Inquire about a quote or request a same-day medical courier pickup in Los Angeles, Orange and Ventura counties.",
  alternates: { canonical: "/quote" },
};

const expectations = [
  {
    title: "Reviewed during business hours",
    text: "Dispatch reviews requests Monday to Friday, 9am to 6pm. Weekend hours vary.",
  },
  {
    title: "Confirmed before we dispatch",
    text: "We call to confirm the pickup time and price before a driver is sent.",
  },
  {
    title: "No patient details needed",
    text: "For medical runs we only need addresses, timing and what's being sent.",
  },
];

export default function QuotePage() {
  return (
    <section className="py-14 sm:py-20">
      <Container className="grid items-start gap-10 lg:grid-cols-[1fr_1.9fr] lg:gap-14">
        <div>
          <h1 className="font-display text-5xl font-medium leading-[1.06] [text-wrap:pretty] lg:text-[3.4rem]">
            Inquire about a quote
          </h1>
          <p className="mt-5 text-lg text-steel">
            Three short steps. Dispatch reviews every request and calls you back
            to confirm the time and price.
          </p>
          <div className="mt-8 hidden rounded-lg bg-ink p-6 text-white lg:block">
            <p className="text-white/75">Faster by phone, Mon–Fri 9am–6pm</p>
            <a
              href={site.phoneHref}
              className="mt-1 flex items-center gap-2.5 text-[1.7rem] font-semibold tabular-nums hover:text-white/90"
            >
              <Phone className="size-5" aria-hidden />
              {site.phone}
            </a>
          </div>
          <ul className="mt-8 hidden border-t border-line lg:block">
            {expectations.map((e) => (
              <li key={e.title} className="border-b border-line py-4">
                <p className="font-semibold">{e.title}</p>
                <p className="text-sm text-steel">{e.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <Suspense fallback={<div className="h-[560px] rounded-lg bg-white ring-1 ring-line" />}>
          <QuoteForm />
        </Suspense>
      </Container>
    </section>
  );
}
