// Email templates for the request form: one to Kenjax staff, one confirmation to the customer.
// Table-based HTML with inline styles so it renders in Gmail, Outlook and Apple Mail.

import { modes, services, speeds, type QuoteInput } from "./quote";
import { site } from "./site";

const INK = "#0E2F3A";
const RED = "#EE3823";
const SLATE = "#556870";
const LINE = "#D7E1E2";
const MINT = "#E8F1EF";
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const LOGO = `${site.url}/kenjax-logo-ink.png`;

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function when(q: QuoteInput): string {
  if (q.mode === "schedule" && q.date) {
    const d = new Date(`${q.date}T12:00:00`);
    const day = isNaN(d.getTime())
      ? q.date
      : d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    return q.time ? `${day} at ${fmtTime(q.time)}` : day;
  }
  return modes[q.mode];
}

function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  if (isNaN(h)) return t;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}

function details(q: QuoteInput): [string, string][] {
  const r: [string, string][] = [
    ["When", when(q)],
    ["Sending", q.item],
  ];
  if (q.speed) r.push(["Speed", speeds[q.speed]]);
  r.push(["Pickup", q.pickup], ["Deliver to", q.dropoff]);
  if (q.details) r.push(["Notes", q.details]);
  return r;
}

function table(rows: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid ${LINE}">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:12px 16px 12px 0;border-bottom:1px solid ${LINE};font:14px/1.5 ${FONT};color:${SLATE};vertical-align:top;white-space:nowrap;width:110px">${esc(k)}</td><td style="padding:12px 0;border-bottom:1px solid ${LINE};font:15px/1.5 ${FONT};color:${INK};white-space:pre-wrap">${v}</td></tr>`,
    )
    .join("")}</table>`;
}

function shell(preheader: string, body: string, footer: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Kenjax Courier</title></head>
<body style="margin:0;padding:0;background:#F3F6F7">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6F7"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid ${LINE};border-radius:8px">
<tr><td style="padding:28px 32px 20px;border-bottom:1px solid ${LINE}"><a href="${site.url}"><img src="${LOGO}" width="170" alt="Kenjax Courier" style="display:block;border:0;width:170px;height:auto"></a></td></tr>
<tr><td style="padding:28px 32px 32px">${body}</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px"><tr><td style="padding:20px 32px;font:13px/1.6 ${FONT};color:${SLATE}">${footer}</td></tr></table>
</td></tr></table></body></html>`;
}

const h1 = (t: string) =>
  `<h1 style="margin:0 0 12px;font:600 26px/1.2 Georgia,'Times New Roman',serif;color:${INK}">${t}</h1>`;
const p = (t: string, extra = "") =>
  `<p style="margin:0 0 16px;font:16px/1.6 ${FONT};color:${INK};${extra}">${t}</p>`;
const button = (href: string, label: string, bg = RED) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 8px 0 0;display:inline-table"><tr><td style="background:${bg};border-radius:6px"><a href="${href}" style="display:inline-block;padding:12px 20px;font:600 15px ${FONT};color:#FFFFFF;text-decoration:none">${label}</a></td></tr></table>`;

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Email to Kenjax staff. Reply-to is the customer. */
export function staffEmail(q: QuoteInput) {
  const urgent = q.mode === "now";
  const tag = urgent ? "PICKUP NOW" : q.mode === "schedule" ? "Scheduled pickup" : "Quote request";
  const subject = `${urgent ? "PICKUP NOW: " : ""}${q.item} – ${q.name}${q.company ? ` (${q.company})` : ""}`;

  const customer: [string, string][] = [
    ["Name", esc(q.name)],
    ...(q.company ? ([["Company", esc(q.company)]] as [string, string][]) : []),
    ["Phone", `<a href="${telHref(q.phone)}" style="color:${INK}">${esc(q.phone)}</a>`],
    ["Email", `<a href="mailto:${esc(q.email)}" style="color:${INK}">${esc(q.email)}</a>`],
  ];

  const body = `
<p style="margin:0 0 14px"><span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${urgent ? RED : MINT};color:${urgent ? "#FFFFFF" : INK};font:600 13px ${FONT}">${tag}</span></p>
${h1(`New ${services[q.service].label} request`)}
${p(`Call the customer to confirm the pickup time and price.${urgent ? " They asked for a pickup now." : ""}`, `color:${SLATE}`)}
<div style="margin:20px 0 24px">${button(telHref(q.phone), `Call ${esc(q.name.split(" ")[0])}`)}${button(`mailto:${esc(q.email)}`, "Reply by email", INK)}</div>
<h2 style="margin:0 0 8px;font:600 16px ${FONT};color:${INK}">Delivery</h2>
${table(details(q).map(([k, v]) => [k, esc(v)]))}
<h2 style="margin:28px 0 8px;font:600 16px ${FONT};color:${INK}">Customer</h2>
${table(customer)}`;

  const text = [
    tag,
    "",
    ...details(q).map(([k, v]) => `${k}: ${v}`),
    "",
    `Name: ${q.name}`,
    ...(q.company ? [`Company: ${q.company}`] : []),
    `Phone: ${q.phone}`,
    `Email: ${q.email}`,
    "",
    "Reply to this email to write to the customer.",
  ].join("\n");

  return {
    subject,
    html: shell(`${tag}: ${q.item} from ${q.pickup}`, body, `Sent from the request form on ${site.url.replace("https://", "")}. Replying goes to the customer.`),
    text,
  };
}

/** Confirmation to the customer. Reply-to is Kenjax. */
export function customerEmail(q: QuoteInput) {
  const first = q.name.split(" ")[0];
  const subject =
    q.mode === "quote" ? "We received your quote request" : "We received your pickup request";
  const lead =
    q.mode === "quote"
      ? "A dispatcher will call you with a price."
      : "A dispatcher will call you to confirm the pickup time and price before a driver is sent.";

  const body = `
${h1(`Thanks, ${esc(first)}. We have your request.`)}
${p(lead)}
${p(`We'll call <strong>${esc(q.phone)}</strong> during business hours, Monday to Friday, 9am to 6pm. Weekend hours vary.`)}
<div style="margin:20px 0 24px;padding:16px 18px;background:${MINT};border-radius:6px;font:15px/1.6 ${FONT};color:${INK}">
<strong>Your pickup isn't booked until we call you.</strong> If it can't wait, call dispatch at <a href="${site.phoneHref}" style="color:${INK};font-weight:600">${site.phone}</a>.
</div>
<h2 style="margin:0 0 8px;font:600 16px ${FONT};color:${INK}">What you sent us</h2>
${table(details(q).map(([k, v]) => [k, esc(v)]))}
${p(`Need to change something? Reply to this email or call ${site.phone}.`, `margin-top:24px;color:${SLATE}`)}`;

  const text = [
    `Thanks, ${first}. We have your request.`,
    "",
    lead,
    `We'll call ${q.phone} during business hours, Monday to Friday, 9am to 6pm. Weekend hours vary.`,
    "",
    `Your pickup isn't booked until we call you. If it can't wait, call dispatch at ${site.phone}.`,
    "",
    "What you sent us:",
    ...details(q).map(([k, v]) => `${k}: ${v}`),
    "",
    `Need to change something? Reply to this email or call ${site.phone}.`,
    "",
    `Kenjax Courier · ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postal}`,
  ].join("\n");

  const footer = `Kenjax Courier<br>${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postal}<br><a href="${site.phoneHref}" style="color:${SLATE}">${site.phone}</a> · <a href="mailto:${site.email}" style="color:${SLATE}">${site.email}</a><br><br>You're receiving this because this address was entered on our request form.`;

  return { subject, html: shell(`${lead}`, body, footer), text };
}
