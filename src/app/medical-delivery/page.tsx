import type { Metadata } from "next";
import { Phone } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import { ButtonA, ButtonLink, Container, PageHeader, SectionHeading } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medical & Rx courier in Los Angeles",
  description:
    "Same-day delivery of prescriptions, lab specimens, X-rays, medical records, vaccines and supplies across Los Angeles, Orange and Ventura counties. Rush pickups within 45 minutes.",
  alternates: { canonical: "/medical-delivery" },
};

const items = [
  {
    title: "Prescriptions & Rx",
    text: "Same-day prescription delivery for pharmacies sending to patients, clinics, nursing homes and other pharmacies.",
  },
  {
    title: "Lab specimens & test results",
    text: "Pickups from collection sites and offices, dropped at the lab. Results returned to the ordering office the same day.",
  },
  {
    title: "X-rays & imaging",
    text: "Films, discs and printed studies moved between imaging centers, specialists and referring offices.",
  },
  {
    title: "Medical records",
    text: "Charts and records delivered by hand to the office or person you specify.",
  },
  {
    title: "Vaccines",
    text: "Moved directly from pharmacy or distributor to clinic, so they spend as little time in transit as possible.",
  },
  {
    title: "Medical supplies & devices",
    text: "Boxes of supplies by car. Heavy medical equipment over 200 lbs by truck or pickup.",
  },
];

const facilities = [
  "Pharmacies",
  "Hospitals",
  "Clinical and reference labs",
  "Clinics and doctor offices",
  "Dental offices",
  "Nursing homes and assisted living",
  "Research facilities",
  "Veterinary practices",
];

export default function MedicalDelivery() {
  return (
    <>
      <PageHeader
        title="Medical & Rx delivery"
        intro="Prescriptions, specimens, imaging and records moved across Southern California the same day."
      >
        <ButtonLink href="/quote">Inquire about a quote</ButtonLink>
        <ButtonA href={site.phoneHref} variant="secondary">
          <Phone className="size-4" aria-hidden />
          <span className="tabular-nums">{site.phone}</span>
        </ButtonA>
      </PageHeader>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading title="What we deliver" />
          <dl className="grid gap-px overflow-hidden rounded-lg bg-line ring-1 ring-line md:grid-cols-2">
            {items.map((item) => (
              <div key={item.title} className="bg-white p-7">
                <dt className="font-display text-2xl font-medium">{item.title}</dt>
                <dd className="mt-2 text-steel">{item.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-medium leading-[1.06] sm:text-5xl">
              When it has to be there
            </h2>
            <p className="prose-measure mt-5 text-lg text-steel">
              Choose the speed that fits the item. Stat specimens and urgent
              prescriptions go Rush. Routine records and supply runs can
              go Regular or Economy, or on a standing schedule.
            </p>
            <ul className="mt-6 space-y-3">
              <li>
                <strong>Rush:</strong> picked up within 45 minutes.
              </li>
              <li>
                <strong>Regular:</strong> delivered within 3 to 5 hours for
                orders ready before 3pm.
              </li>
              <li>
                <strong>Economy:</strong> ready by 10:30am, delivered by 5pm.
              </li>
              <li>
                <strong>Scheduled routes:</strong> daily lab or pharmacy runs at
                set times.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-4xl font-medium leading-[1.06] sm:text-5xl">
              Who we work with
            </h2>
            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {facilities.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="size-1.5 shrink-0 rounded-full bg-ink-2" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaBand
        title="Need a stat pickup?"
        text="Call dispatch Monday to Friday, 9am to 6pm. Rush pickups happen within 45 minutes."
      />
    </>
  );
}
