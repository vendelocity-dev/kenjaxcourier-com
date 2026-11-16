import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ButtonLink, Container, PageHeader } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call Kenjax Courier dispatch Monday to Friday, 9am to 6pm, at ${site.phone}, email ${site.email}, or visit us in Sherman Oaks.`,
  alternates: { canonical: "/contact" },
};

const mapSrc =
  "https://maps.google.com/maps?q=15260%20Ventura%20Blvd%20Suite%201210%2C%20Sherman%20Oaks%2C%20CA%2091436&z=15&output=embed";

export default function Contact() {
  return (
    <>
      <PageHeader
        title="Contact us"
        intro="For a pickup right now, call dispatch. For quotes, recurring routes or anything else, send a request or email us."
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <ul className="space-y-8">
            <li className="flex gap-4">
              <Phone className="mt-1 size-6 shrink-0 text-signal" aria-hidden />
              <div>
                <h2 className="text-lg font-semibold">Dispatch</h2>
                <a href={site.phoneHref} className="font-display text-4xl font-medium tabular-nums hover:text-signal">
                  {site.phone}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 size-6 shrink-0 text-signal" aria-hidden />
              <div>
                <h2 className="text-lg font-semibold">Email</h2>
                <a href={`mailto:${site.email}`} className="text-lg underline-offset-4 hover:underline">
                  {site.email}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MapPin className="mt-1 size-6 shrink-0 text-signal" aria-hidden />
              <div>
                <h2 className="text-lg font-semibold">Office</h2>
                <p className="text-lg">
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.region} {site.address.postal}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-1 size-6 shrink-0 text-signal" aria-hidden />
              <div>
                <h2 className="text-lg font-semibold">Hours</h2>
                <p className="text-lg">
                  {site.hours.weekdays}
                  <br />
                  <span className="text-steel">{site.hours.weekend}. Call ahead to check.</span>
                </p>
              </div>
            </li>
            <li>
              <ButtonLink href="/quote">Inquire about a quote</ButtonLink>
            </li>
          </ul>

          <div className="overflow-hidden rounded-lg ring-1 ring-line">
            <iframe
              title="Map of Kenjax Courier's office in Sherman Oaks"
              src={mapSrc}
              className="h-[420px] w-full lg:h-full lg:min-h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
