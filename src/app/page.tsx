import type { Metadata } from "next";
import {
  FileText,
  FlaskConical,
  Pill,
  ScanLine,
  Stethoscope,
  Syringe,
  Phone,
} from "lucide-react";
import ArrivalPlanner from "@/components/ArrivalPlanner";
import CtaBand from "@/components/CtaBand";
import { ButtonA, ButtonLink, Container, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const carries = [
  { icon: Pill, title: "Prescriptions", text: "Pharmacy to patient, clinic or care facility, the same day." },
  { icon: FlaskConical, title: "Lab specimens & results", text: "Between collection sites, labs and the ordering office." },
  { icon: ScanLine, title: "X-rays & imaging", text: "Films, discs and printed studies moved between offices and specialists." },
  { icon: FileText, title: "Medical records", text: "Charts and records delivered by hand to the office or person you specify." },
  { icon: Syringe, title: "Vaccines", text: "Moved directly between pharmacy, clinic and facility." },
  { icon: Stethoscope, title: "Supplies & equipment", text: "Boxes of supplies by car, and devices over 200 lbs by truck." },
];

const commitments = [
  {
    title: "A dispatcher picks up",
    text: "Call Monday to Friday, 9am to 6pm, and you reach a dispatcher who can book your run on the spot. Weekend hours vary, so call ahead.",
  },
  {
    title: "Time and price confirmed first",
    text: "Before a driver is sent, dispatch confirms the pickup time and the price with you, so nothing on the invoice is a surprise.",
  },
  {
    title: "Cutoffs in plain writing",
    text: "Our same-day cutoffs are published on this site. You'll know before you call whether a run can make it today.",
  },
];

const clients = [
  "Pharmacies",
  "Hospitals",
  "Clinical labs",
  "Clinics & physician offices",
  "Dental offices",
  "Nursing homes",
  "Research facilities",
  "Veterinary practices",
];

const steps = [
  {
    title: "Request",
    text: "Call dispatch or send the request form. Tell us what's going, where, and by when.",
  },
  {
    title: "Pickup",
    text: "A driver is dispatched right away. Rush pickups happen within 45 minutes.",
  },
  {
    title: "Delivery",
    text: "The item is handed off at the destination before your deadline.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <Container className="grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.08fr_1fr] lg:gap-16 lg:py-28">
          <div>
            <h1 className="font-display text-[2.9rem] font-medium leading-[1.03] sm:text-6xl lg:text-[4.4rem]">
              Same-day medical courier for Los Angeles pharmacies, labs and clinics.
            </h1>
            <p className="prose-measure mt-7 text-lg text-steel sm:text-xl">
              Prescriptions, specimens, imaging and records, delivered on your
              deadline. Rush pickups within 45 minutes. Dispatch is open Monday
              to Friday, 9am to 6pm.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/quote">Inquire about a quote</ButtonLink>
              <ButtonA href={site.phoneHref} variant="secondary">
                <Phone className="size-4" aria-hidden />
                <span className="tabular-nums">{site.phone}</span>
              </ButtonA>
            </div>
            <p className="mt-8 text-sm text-steel">
              Serving Los Angeles, Orange and Ventura counties from Sherman Oaks.
            </p>
          </div>
          <ArrivalPlanner />
        </Container>
      </section>

      {/* What we carry */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            title="What we carry"
            intro="We deliver for healthcare only, where a missed hour means a missed dose, a delayed result or a rescheduled patient."
          />
          <ul className="grid gap-x-14 md:grid-cols-2">
            {carries.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5 border-t border-line py-7">
                <Icon className="mt-1 size-5 shrink-0 text-ink-2" aria-hidden strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-[1.45rem] font-medium leading-tight">{title}</h3>
                  <p className="mt-1.5 text-steel">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/medical-delivery" variant="secondary">
              Medical & Rx delivery details
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* What you can count on */}
      <section className="bg-ice py-24 sm:py-28">
        <Container>
          <SectionHeading title="What you can count on" />
          <ul className="grid gap-10 md:grid-cols-3 md:gap-12">
            {commitments.map((c) => (
              <li key={c.title} className="border-l-2 border-ink pl-6">
                <h3 className="font-display text-2xl font-medium leading-snug">{c.title}</h3>
                <p className="mt-3 text-steel">{c.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Who we serve */}
      <section className="py-24 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <h2 className="font-display text-4xl font-medium leading-[1.08] sm:text-[2.9rem]">
            Built for the offices that keep healthcare running
          </h2>
          <ul className="grid sm:grid-cols-2 sm:gap-x-12">
            {clients.map((c) => (
              <li key={c} className="border-b border-line py-4 text-lg">
                {c}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* How a run works */}
      <section className="border-t border-line bg-white py-24 sm:py-28">
        <Container>
          <SectionHeading title="How a run works" />
          <ol className="relative grid gap-12 md:grid-cols-3 md:gap-10">
            <span aria-hidden className="absolute left-0 right-0 top-[1.6rem] hidden h-px bg-line md:block" />
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="relative inline-flex size-[3.2rem] items-center justify-center rounded-full bg-white font-display text-2xl font-medium ring-1 ring-ink">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-steel">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
