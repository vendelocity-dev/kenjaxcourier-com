"use client";

import { useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import {
  modes,
  services,
  speeds,
  validateQuote,
} from "@/lib/quote";
import { site } from "@/lib/site";

type Values = Record<string, string>;

const stepFields: string[][] = [
  ["mode", "item", "speed", "date"],
  ["pickup", "dropoff"],
  ["name", "phone", "email"],
];
const stepTitles = ["What and when", "Pickup and delivery", "Your contact details"];

const inputCls =
  "mt-1.5 block w-full rounded-md border-0 bg-white px-3.5 py-2.5 text-ink ring-1 ring-inset ring-line placeholder:text-steel/70 focus:ring-2 focus:ring-ink focus:outline-none aria-[invalid=true]:ring-signal";

function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-medium">
        {label}
      </label>
      {hint && <p className="text-sm text-steel">{hint}</p>}
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-signal-dark">
          {error}
        </p>
      )}
    </div>
  );
}

function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-md px-4 py-3 ring-1 ring-inset transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-signal ${
        checked ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:ring-ink"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {children}
    </label>
  );
}

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({
    mode: "now",
    service: "medical",
    speed: "rush",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  const set = (k: string, v: string) => {
    setValues((prev) => {
      const next = { ...prev, [k]: v };
      return next;
    });
    setErrors((e) => {
      const rest = { ...e };
      delete rest[k];
      return rest;
    });
  };

  const items = services.medical.items;

  function errorsFor(fields: string[]) {
    const r = validateQuote(values);
    if (r.ok) return {};
    return Object.fromEntries(Object.entries(r.errors).filter(([k]) => fields.includes(k)));
  }

  function focusFirstError(errs: Record<string, string>) {
    const first = Object.keys(errs)[0];
    if (first) requestAnimationFrame(() => document.getElementsByName(first)[0]?.focus());
  }

  function next() {
    const errs = errorsFor(stepFields[step]);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    setStep((s) => s + 1);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function back() {
    setStep((s) => s - 1);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 2) return next();
    const errs = errorsFor(stepFields.flat());
    setErrors(errs);
    if (Object.keys(errs).length) {
      const firstStep = stepFields.findIndex((f) => f.some((k) => k in errs));
      setStep(firstStep);
      return focusFirstError(errs);
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || "Some details need fixing. Check the highlighted fields.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Your request didn't send.");
    }
  }

  if (status === "sent") {
    const summary: [string, string][] = [
      ["Sending", values.item],
      ["Speed", speeds[values.speed as keyof typeof speeds]],
      ["Pickup", values.pickup],
      ...(values.dropoff ? [["Deliver to", values.dropoff] as [string, string]] : []),
    ];
    return (
      <div className="rounded-lg bg-white p-6 ring-1 ring-line sm:p-8" role="status">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-7 text-live" aria-hidden />
          <h2 className="font-display text-4xl font-medium leading-[1.08]">Request sent</h2>
        </div>
        <p className="mt-4 text-lg text-steel">
          Dispatch will call you at <strong className="whitespace-nowrap text-ink">{values.phone}</strong> to
          confirm {values.mode === "quote" ? "your quote" : "the pickup time and price"}. We also
          emailed a copy of your request to <strong className="text-ink">{values.email}</strong>.
          {values.mode === "now" && (
            <>
              {" "}If it can&apos;t wait for a callback, call{" "}
              <a href={site.phoneHref} className="whitespace-nowrap font-semibold text-ink underline">
                {site.phone}
              </a>
              .
            </>
          )}
        </p>
        <dl className="mt-7 border-t border-line">
          {summary.map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[9rem_1fr]">
              <dt className="text-sm text-steel">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <a href="/quote" className="mt-7 inline-flex h-12 items-center rounded-md px-5 font-semibold ring-1 ring-inset ring-ink/25 hover:ring-ink">
          Send another request
        </a>
      </div>
    );
  }

  const fieldProps = (name: string) => ({
    id: name,
    name,
    value: values[name] ?? "",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className="relative rounded-lg bg-white p-6 ring-1 ring-line sm:p-8">
      {/* Progress */}
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Form progress">
        {stepTitles.map((t, i) => (
          <li key={t} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${i <= step ? "bg-signal" : "bg-ice"}`} />
            <span className={`mt-2 hidden text-sm sm:block ${i === step ? "font-semibold" : "text-steel"}`}>
              {i + 1}. {t}
            </span>
          </li>
        ))}
      </ol>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-3xl font-medium leading-[1.06] outline-none"
      >
        <span className="sr-only">Step {step + 1} of 3: </span>
        {stepTitles[step]}
      </h2>

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website ?? ""} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div className="mt-6 space-y-6">
        {step === 0 && (
          <>
            <fieldset>
              <legend className="font-medium">When do you need it?</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {Object.entries(modes).map(([k, label]) => (
                  <Choice key={k} name="mode" value={k} checked={values.mode === k} onChange={(v) => set("mode", v)}>
                    {label}
                  </Choice>
                ))}
              </div>
            </fieldset>

            {values.mode === "now" && (
              <p className="flex items-start gap-3 rounded-md bg-ice px-4 py-3">
                <Phone className="mt-1 size-4 shrink-0" aria-hidden />
                <span>
                  For a Rush pickup during business hours (Mon–Fri, 9am–6pm), calling is fastest:{" "}
                  <a href={site.phoneHref} className="whitespace-nowrap font-semibold underline tabular-nums">
                    {site.phone}
                  </a>
                </span>
              </p>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="What are you sending?" name="item" error={errors.item}>
                <select {...fieldProps("item")} onChange={(e) => set("item", e.target.value)} className={inputCls}>
                  <option value="">Choose one</option>
                  {items.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </Field>

                <Field label="Delivery speed" name="speed" error={errors.speed}>
                  <select {...fieldProps("speed")} onChange={(e) => set("speed", e.target.value)} className={inputCls}>
                    {Object.entries(speeds).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
            </div>

            {values.mode === "schedule" && (
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Pickup date" name="date" error={errors.date}>
                  <input type="date" {...fieldProps("date")} onChange={(e) => set("date", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Pickup time (optional)" name="time">
                  <input type="time" {...fieldProps("time")} onChange={(e) => set("time", e.target.value)} className={inputCls} />
                </Field>
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Pickup address" name="pickup" error={errors.pickup}>
              <input
                {...fieldProps("pickup")}
                autoComplete="street-address"
                placeholder="Street, suite, city"
                onChange={(e) => set("pickup", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field
              label="Delivery address"
              name="dropoff"
              error={errors.dropoff}
            >
              <input
                {...fieldProps("dropoff")}
                placeholder="Street, suite, city"
                onChange={(e) => set("dropoff", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field
              label="Anything we should know? (optional)"
              name="details"
              hint="Size, weight, deadline or handling needs. Don't include patient names or health information."
            >
              <textarea
                {...fieldProps("details")}
                rows={4}
                onChange={(e) => set("details", e.target.value)}
                className={inputCls}
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Your name" name="name" error={errors.name}>
                <input {...fieldProps("name")} autoComplete="name" onChange={(e) => set("name", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Company (optional)" name="company">
                <input {...fieldProps("company")} autoComplete="organization" onChange={(e) => set("company", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Phone" name="phone" error={errors.phone}>
                <input type="tel" {...fieldProps("phone")} autoComplete="tel" onChange={(e) => set("phone", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Email" name="email" error={errors.email}>
                <input type="email" {...fieldProps("email")} autoComplete="email" onChange={(e) => set("email", e.target.value)} className={inputCls} />
              </Field>
            </div>
            {status === "error" && (
              <p role="alert" className="rounded-md bg-signal/10 px-4 py-3 font-medium text-signal-dark">
                {serverError}
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
        {step > 0 ? (
          <button type="button" onClick={back} className="rounded-md px-4 py-3 font-semibold ring-1 ring-inset ring-line hover:ring-ink">
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-signal px-6 py-3 font-semibold text-white hover:bg-signal-dark disabled:opacity-60"
        >
          {step < 2 ? "Continue" : status === "sending" ? "Sending…" : values.mode === "quote" ? "Send quote request" : "Send pickup request"}
        </button>
      </div>
    </form>
  );
}
