import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost-light";

const variants: Record<Variant, string> = {
  primary: "bg-signal text-white hover:bg-signal-dark",
  secondary: "bg-white text-ink ring-1 ring-inset ring-ink/25 hover:ring-ink",
  "ghost-light":
    "bg-transparent text-white ring-1 ring-inset ring-white/35 hover:ring-white",
};

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 font-semibold text-[0.97rem] transition-colors";

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

export function ButtonA({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return <a className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-white">
      <Container className="py-16 sm:py-24">
        <h1 className="max-w-4xl font-display text-5xl font-medium leading-[1.04] sm:text-[4.25rem]">
          {title}
        </h1>
        <p className="prose-measure mt-6 text-lg text-steel sm:text-xl">{intro}</p>
        {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
      </Container>
    </section>
  );
}

export function SectionHeading({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-12 max-w-3xl">
      <h2 className="font-display text-4xl font-medium leading-[1.08] sm:text-[2.9rem]">
        {title}
      </h2>
      {intro && <p className="prose-measure mt-4 text-lg text-steel">{intro}</p>}
    </div>
  );
}
