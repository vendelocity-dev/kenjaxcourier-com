import type { Metadata } from "next";
import ArrivalPlanner from "@/components/ArrivalPlanner";
import CtaBand from "@/components/CtaBand";
import { ButtonLink, Container, PageHeader, SectionHeading } from "@/components/ui";
import { tiers } from "@/lib/site";

export const metadata: Metadata = {
  title: "Medical delivery speeds: Rush, Regular, Economy & Scheduled",
  description:
    "Compare Kenjax medical courier speeds: Rush pickup within 45 minutes, Regular in 3 to 5 hours, Economy by 5pm, plus scheduled and next-business-day delivery.",
  alternates: { canonical: "/same-day" },
};

export default function SameDay() {
  return (
    <>
      <PageHeader
        title="Delivery speeds"
        intro="Four ways to move prescriptions, specimens, records and medical supplies across Los Angeles, Orange and Ventura counties. Pick the speed that fits the item."
      >
        <ButtonLink href="/quote">Inquire about a quote</ButtonLink>
      </PageHeader>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading title="Delivery speeds" />
          <div className="overflow-x-auto rounded-lg ring-1 ring-line">
            <table className="w-full min-w-[640px] border-collapse bg-white text-left">
              <thead className="bg-ink text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Service</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Timing</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Order cutoff</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((t) => (
                  <tr key={t.id} className="border-t border-line align-top">
                    <th scope="row" className="px-6 py-5 font-display text-2xl font-medium">
                      {t.name}
                    </th>
                    <td className="px-6 py-5">
                      {t.summary}
                      <span className="mt-1 block text-sm text-steel">{t.detail}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-steel">{t.cutoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="bg-ice py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-medium leading-[1.06] sm:text-5xl">
              Which one gets it there in time?
            </h2>
            <p className="prose-measure mt-5 text-lg text-steel">
              Set the time your package will be ready. The chart shows when each
              same-day service would deliver it.
            </p>
          </div>
          <ArrivalPlanner />
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-medium leading-[1.06]">
              Next-day and recurring runs
            </h2>
            <p className="prose-measure mt-5 text-steel">
              Orders placed after 6pm go out the next business day. For daily
              pharmacy deliveries and lab pickups, we can set up a recurring
              route under a service contract. Drivers deliver after hours when a
              run needs it.
            </p>
          </div>
          <div>
            <h2 className="font-display text-4xl font-medium leading-[1.06]">
              Medical equipment and heavy items
            </h2>
            <p className="prose-measure mt-5 text-steel">
              Trucks and pickups are available for medical equipment over 200 lbs. Items over
              50 lbs, fragile items and irregular shapes carry an added fee.
              Tell us the size and weight in your request and we&apos;ll include
              it in the quote.
            </p>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
