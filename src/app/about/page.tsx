import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import { Container, PageHeader } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kenjax Courier is a Sherman Oaks-based same-day medical courier serving pharmacies, labs and clinics across Southern California.",
  alternates: { canonical: "/about" },
};

const facts = [
  { label: "In business since", value: "2013" },
  { label: "Headquarters", value: "Sherman Oaks, CA" },
  { label: "Hours", value: "Mon–Fri, 9am–6pm" },
  { label: "Weekends", value: "Hours vary" },
  { label: "Coverage", value: "Los Angeles, Orange & Ventura counties" },
];

export default function About() {
  return (
    <>
      <PageHeader
        title="About Kenjax Courier"
        intro="A Southern California medical courier built around one idea: deliveries that affect patients deserve a dispatcher who picks up and a driver who shows up."
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div className="prose-measure space-y-5 text-lg">
            <p>
              Since 2013, Kenjax Courier has run same-day medical deliveries from
              our base in Sherman Oaks. Healthcare is all we do: prescriptions for
              pharmacies, specimens and results for labs, imaging and records
              for medical offices, and supplies and equipment for clinics and
              care facilities.
            </p>
            <p>
              We keep the service simple. You call or send a request, we tell you
              when it will be picked up and when it will arrive, and we hold to
              it. Dispatch takes orders Monday to Friday, 9am to 6pm, and our
              drivers deliver after hours when a run needs it. Orders placed after
              6pm go out the next business day. Weekend availability varies, so
              call ahead for Saturday and Sunday runs.
            </p>
            <p>
              Many of our clients have worked with us for years under ongoing
              service contracts. Our goal is for every pharmacy, lab and clinic we
              serve to treat us like part of their own staff: the courier they
              don&apos;t have to think about.
            </p>
          </div>
          <dl className="h-fit divide-y divide-line rounded-lg bg-white ring-1 ring-line">
            {facts.map((f) => (
              <div key={f.label} className="p-6">
                <dt className="text-steel">{f.label}</dt>
                <dd className="font-display text-2xl font-medium">{f.value}</dd>
              </div>
            ))}
            <div className="p-6">
              <dt className="text-steel">Address</dt>
              <dd className="font-semibold">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postal}
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
