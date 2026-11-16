"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Status = { tone: "open" | "closed" | "weekend"; text: string; short: string };

// Weekday hours: Monday–Friday, 9am–6pm Pacific. Weekend hours vary.
function getStatus(now: Date): Status {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const day = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 12);

  if (day === "Sat" || day === "Sun") {
    return {
      tone: "weekend",
      text: `${site.hours.weekend}. Call to check today's availability.`,
      short: "Weekend hours vary",
    };
  }
  if (hour >= 9 && hour < 18) {
    return { tone: "open", text: "Dispatch is open now until 6pm.", short: "Open until 6pm" };
  }
  const opens = hour < 9 ? "today at 9am" : day === "Fri" ? "Monday at 9am" : "tomorrow at 9am";
  return { tone: "closed", text: `Dispatch is closed. Opens ${opens}.`, short: `Opens ${opens}` };
}

const dot: Record<Status["tone"], string> = {
  open: "bg-live",
  closed: "bg-white/40",
  weekend: "bg-amber-300",
};

export default function OpenStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getStatus(new Date()));
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  if (!status) {
    return (
      <span>
        Dispatch hours: {site.hours.weekdaysShort}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2.5">
      <span className={`size-2 shrink-0 rounded-full ${dot[status.tone]}`} aria-hidden />
      <span className="sm:hidden">{status.short}</span>
      <span className="hidden sm:inline">
        {status.text}
        {status.tone !== "weekend" && (
          <span className="text-white/60"> Hours: {site.hours.weekdaysShort}.</span>
        )}
      </span>
    </span>
  );
}
