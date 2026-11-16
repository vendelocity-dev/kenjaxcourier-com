export const site = {
  name: "Kenjax Courier",
  url: "https://kenjaxcourier.com",
  phone: "(866) 285-9477",
  phoneHref: "tel:+18662859477",
  email: "information@kenjaxinc.com",
  address: {
    street: "15260 Ventura Blvd, Suite 1210",
    city: "Sherman Oaks",
    region: "CA",
    postal: "91436",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=15260+Ventura+Blvd+Suite+1210+Sherman+Oaks+CA+91436",
  counties: ["Los Angeles County", "Orange County", "Ventura County"],
  hours: {
    weekdays: "Monday – Friday, 9:00am – 6:00pm",
    weekdaysShort: "Mon–Fri, 9am–6pm",
    weekend: "Saturday & Sunday hours vary",
  },
  description:
    "Same-day medical courier for Los Angeles pharmacies, labs and clinics. Rush pickups within 45 minutes. Open Monday to Friday, 9am to 6pm.",
};

export const nav = [
  { href: "/medical-delivery", label: "Medical & Rx" },
  { href: "/same-day", label: "Delivery speeds" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const tiers = [
  {
    id: "rush",
    name: "Rush",
    summary: "Picked up within 45 minutes for your most urgent runs.",
    detail:
      "For stat specimens, urgent prescriptions and anything that can't wait. Delivery time depends on distance.",
    cutoff: "During business hours",
  },
  {
    id: "regular",
    name: "Regular",
    summary: "Delivered within 3 to 5 hours across the Los Angeles area.",
    detail: "Our everyday same-day service for orders ready before 3pm.",
    cutoff: "Ready before 3:00pm",
  },
  {
    id: "economy",
    name: "Economy",
    summary: "Picked up within the hour, delivered by 5pm.",
    detail: "The lowest-cost same-day option for orders ready before 10:30am.",
    cutoff: "Ready before 10:30am",
  },
  {
    id: "scheduled",
    name: "Scheduled",
    summary: "Pickup and delivery at the times you choose.",
    detail: "Book ahead for next-business-day delivery, or set up a recurring daily pharmacy or lab route.",
    cutoff: "Booked in advance",
  },
] as const;
