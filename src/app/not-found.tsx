import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="font-display text-6xl font-medium leading-[1.06]">This page isn&apos;t here</h1>
      <p className="mt-4 text-lg text-steel">
        The address may have changed when we updated the site. Head home or send a pickup request.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Go to the homepage</ButtonLink>
        <ButtonLink href="/quote" variant="secondary">Inquire about a quote</ButtonLink>
      </div>
    </Container>
  );
}
