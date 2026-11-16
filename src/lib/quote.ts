export const services = {
  medical: {
    label: "Medical & Rx",
    items: [
      "Prescriptions / Rx",
      "Lab specimens",
      "Test results",
      "X-rays / imaging",
      "Medical records",
      "Vaccines",
      "Medical supplies",
      "Medical equipment (heavy)",
    ],
  },
} as const;

export type ServiceKey = keyof typeof services;

export const speeds = {
  rush: "Rush (pickup within 45 min)",
  regular: "Regular (3–5 hours)",
  economy: "Economy (by 5pm)",
  scheduled: "Scheduled / next business day",
} as const;

export const modes = {
  now: "Pick up now",
  schedule: "Schedule a pickup",
  quote: "Just a quote",
} as const;

export type QuoteInput = {
  mode: keyof typeof modes;
  service: ServiceKey;
  item: string;
  speed?: keyof typeof speeds;
  pickup: string;
  dropoff: string;
  date?: string;
  time?: string;
  details?: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  website?: string; // honeypot
};

const str = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Returns a clean object or a map of field errors. */
export function validateQuote(raw: Record<string, unknown>):
  | { ok: true; data: QuoteInput }
  | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const mode = str(raw.mode) as QuoteInput["mode"];
  const service = str(raw.service) as ServiceKey;

  if (!(mode in modes)) errors.mode = "Choose when you need this.";
  if (!(service in services)) errors.service = "Choose a service.";

  const item = str(raw.item, 100);
  if (service in services && !(services[service].items as readonly string[]).includes(item))
    errors.item = "Choose what you're sending.";

  const speed = str(raw.speed) as QuoteInput["speed"];
  if (!(speed && speed in speeds)) {
    errors.speed = "Choose a delivery speed.";
  }

  const pickup = str(raw.pickup, 300);
  const dropoff = str(raw.dropoff, 300);
  if (pickup.length < 5) errors.pickup = "Enter the pickup address.";
  if (dropoff.length < 5) errors.dropoff = "Enter the delivery address.";

  const date = str(raw.date, 20);
  const time = str(raw.time, 20);
  if (mode === "schedule" && !date) errors.date = "Choose a pickup date.";

  const name = str(raw.name, 120);
  const phone = str(raw.phone, 40);
  const email = str(raw.email, 200);
  if (name.length < 2) errors.name = "Enter your name.";
  if (phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a 10-digit phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter an email address like name@company.com.";

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    data: {
      mode,
      service,
      item,
      speed,
      pickup,
      dropoff,
      date: date || undefined,
      time: time || undefined,
      details: str(raw.details, 2000) || undefined,
      name,
      company: str(raw.company, 160) || undefined,
      phone,
      email,
      website: str(raw.website, 200) || undefined,
    },
  };
}
