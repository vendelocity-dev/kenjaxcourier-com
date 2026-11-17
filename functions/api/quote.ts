// Cloudflare Pages Function: handles POST /api/quote from the request form.
// Sends two emails through Resend's HTTPS API:
//   1. the request to Kenjax staff (reply-to: the customer)
//   2. a confirmation to the customer (reply-to: Kenjax)
//
// Settings (Cloudflare dashboard → Pages project → Settings → Variables and Secrets):
//   RESEND_API_KEY        (secret, required)  Resend API key
//   QUOTE_TO_EMAIL        (optional)          staff inbox; defaults to STAFF_INBOX below
//   QUOTE_FROM_EMAIL      (optional)          defaults to "Kenjax Courier <quotes@kenjaxcourier.com>"
//   QUOTE_CONFIRMATIONS   (optional)          "0" turns off the customer confirmation email
//   QUOTE_DRY_RUN         (local testing)     "1" logs the emails instead of sending them

import { validateQuote } from "../../src/lib/quote";
import { customerEmail, staffEmail } from "../../src/lib/emails";
import { site } from "../../src/lib/site";

// TESTING: staff emails (and customer replies) go to admin@kenjaxcourier.com until the
// emails are approved. After approval, change this to site.email (information@kenjaxinc.com).
const STAFF_INBOX = "admin@kenjaxcourier.com";

type Env = {
  RESEND_API_KEY?: string;
  QUOTE_TO_EMAIL?: string;
  QUOTE_FROM_EMAIL?: string;
  QUOTE_CONFIRMATIONS?: string;
  QUOTE_DRY_RUN?: string;
};

type Context = { request: Request; env: Env };

type Mail = { from: string; to: string[]; reply_to: string; subject: string; html: string; text: string };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const sendFailed = () =>
  json(
    { error: `We couldn't send your request online. Call ${site.phone} and dispatch will take it.` },
    502,
  );

async function send(apiKey: string, mail: Mail) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(mail),
  });
  if (!res.ok) console.error("[quote] Resend error", res.status, await res.text());
  return res.ok;
}

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

  const from = env.QUOTE_FROM_EMAIL || "Kenjax Courier <quotes@kenjaxcourier.com>";
  const staff = staffEmail(q);
  const customer = customerEmail(q);
  const staffInbox = env.QUOTE_TO_EMAIL || STAFF_INBOX;
  const staffMail: Mail = { from, to: [staffInbox], reply_to: q.email, ...staff };
  const customerMail: Mail = { from, to: [q.email], reply_to: staffInbox, ...customer };
  const confirm = env.QUOTE_CONFIRMATIONS !== "0";

  if (env.QUOTE_DRY_RUN === "1") {
    console.log(`[quote] DRY RUN staff → ${staffMail.to[0]}: ${staffMail.subject}\n${staff.text}`);
    if (confirm) console.log(`[quote] DRY RUN customer → ${q.email}: ${customerMail.subject}\n${customer.text}`);
    return json({ ok: true, dryRun: true });
  }

  if (!env.RESEND_API_KEY) {
    console.error("[quote] RESEND_API_KEY is not set");
    return sendFailed();
  }

  // The staff email is the one that matters: if it fails, tell the visitor to call.
  if (!(await send(env.RESEND_API_KEY, staffMail))) return sendFailed();

  // The confirmation is a courtesy: a failure is logged but doesn't fail the request.
  if (confirm) await send(env.RESEND_API_KEY, customerMail);

  return json({ ok: true });
}

// Anything other than POST gets a clear answer instead of the 404 page.
export async function onRequest(): Promise<Response> {
  return json({ error: "Use POST." }, 405);
}
