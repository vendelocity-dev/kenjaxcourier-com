// Cloudflare Pages Function: handles POST /api/quote from the request form
// and emails it to Kenjax dispatch through Resend's HTTPS API.
//
// Settings (Cloudflare dashboard → your Pages project → Settings → Variables and Secrets):
//   RESEND_API_KEY    (secret, required)  Resend API key
//   QUOTE_TO_EMAIL    (optional)          defaults to the site email (information@kenjaxinc.com)
//   QUOTE_FROM_EMAIL  (optional)          defaults to "Kenjax Website <quotes@kenjaxcourier.com>"
//   QUOTE_DRY_RUN     (local testing)     "1" logs the email instead of sending it

import { modes, services, speeds, validateQuote, type QuoteInput } from "../../src/lib/quote";
import { site } from "../../src/lib/site";

type Env = {
  RESEND_API_KEY?: string;
  QUOTE_TO_EMAIL?: string;
  QUOTE_FROM_EMAIL?: string;
  QUOTE_DRY_RUN?: string;
};

type Context = { request: Request; env: Env };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function rows(q: QuoteInput): [string, string][] {
  const r: [string, string][] = [
    ["Request type", modes[q.mode]],
    ["Service", services[q.service].label],
    ["Item", q.item],
  ];
  if (q.speed) r.push(["Speed", speeds[q.speed]]);
  r.push(["Pickup", q.pickup]);
  if (q.dropoff) r.push(["Deliver to", q.dropoff]);
  if (q.date) r.push(["Date", `${q.date}${q.time ? ` at ${q.time}` : ""}`]);
  if (q.details) r.push(["Details", q.details]);
  r.push(["Name", q.name]);
  if (q.company) r.push(["Company", q.company]);
  r.push(["Phone", q.phone], ["Email", q.email]);
  return r;
}

const sendFailed = () =>
  json(
    { error: `We couldn't send your request online. Call ${site.phone} and dispatch will take it.` },
    502,
  );

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const result = validateQuote(body);
  if (!result.ok) return json({ errors: result.errors }, 422);
  const q = result.data;

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (q.website) return json({ ok: true });

  const list = rows(q);
  const subject = `${q.mode === "now" ? "PICKUP NOW: " : ""}Medical delivery request from ${q.name}${q.company ? ` (${q.company})` : ""}`;
  const text = list.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${list
    .map(
      ([k, v]) =>
        `<tr><td style="color:#56657c;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("")}</table>`;

  const to = env.QUOTE_TO_EMAIL || site.email;
  const from = env.QUOTE_FROM_EMAIL || "Kenjax Website <quotes@kenjaxcourier.com>";

  if (env.QUOTE_DRY_RUN === "1") {
    console.log(`[quote] DRY RUN to ${to} from ${from}\n${subject}\n${text}`);
    return json({ ok: true, dryRun: true });
  }

  if (!env.RESEND_API_KEY) {
    console.error("[quote] RESEND_API_KEY is not set");
    return sendFailed();
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: q.email, subject, text, html }),
  });

  if (!res.ok) {
    console.error("[quote] Resend error", res.status, await res.text());
    return sendFailed();
  }

  return json({ ok: true });
}

// Anything other than POST gets a clear answer instead of the 404 page.
export async function onRequest(): Promise<Response> {
  return json({ error: "Use POST." }, 405);
}
