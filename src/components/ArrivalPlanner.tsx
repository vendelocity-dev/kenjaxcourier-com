"use client";

import { useId, useState } from "react";
import { site } from "@/lib/site";

// Axis runs 9am (opening) to 8pm, so late Regular windows still fit.
const AXIS_START = 9;
const AXIS_END = 20;
const SPAN = AXIS_END - AXIS_START;

function fmt(h: number) {
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  const suffix = hours >= 12 && hours < 24 ? "pm" : "am";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return mins === 0 ? `${h12}${suffix}` : `${h12}:${String(mins).padStart(2, "0")}${suffix}`;
}

const pct = (h: number) => `${((Math.min(h, AXIS_END) - AXIS_START) / SPAN) * 100}%`;

type Row = {
  name: string;
  available: boolean;
  result: string;
  start: number;
  windowStart: number;
  windowEnd: number;
  pickupOnly?: boolean;
};

function rowsFor(t: number): Row[] {
  return [
    {
      name: "Rush",
      available: true,
      result: `Picked up by ${fmt(t + 0.75)}, delivered based on distance`,
      start: t,
      windowStart: t + 0.75,
      windowEnd: t + 0.75,
      pickupOnly: true,
    },
    {
      name: "Regular",
      available: t < 15,
      result:
        t < 15
          ? `Delivered between ${fmt(t + 3)} and ${fmt(t + 5)}`
          : "Needs to be ready before 3pm",
      start: t,
      windowStart: t + 3,
      windowEnd: t + 5,
    },
    {
      name: "Economy",
      available: t <= 10.5,
      result:
        t <= 10.5
          ? `Picked up by ${fmt(t + 1)}, delivered by 5pm`
          : "Needs to be ready by 10:30am",
      start: t,
      windowStart: Math.max(t + 1, 15),
      windowEnd: 17,
    },
  ];
}

const ticks = [9, 12, 15, 18];

export default function ArrivalPlanner() {
  const [ready, setReady] = useState(10);
  const id = useId();
  const rows = rowsFor(ready);

  return (
    <div className="rounded-lg bg-ink p-6 text-white shadow-[0_30px_60px_-30px_rgba(14,47,58,0.55)] ring-1 ring-ink sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/15 pb-4 text-sm text-white/65">
        <span>Same-day delivery estimate</span>
        <span className="whitespace-nowrap">Orders {site.hours.weekdaysShort}</span>
      </div>
      <label htmlFor={id} className="block">
        <span className="font-display text-[1.7rem] font-medium leading-tight">
          Your package is ready at{" "}
          <output htmlFor={id} className="tabular-nums underline decoration-signal decoration-2 underline-offset-[6px]">
            {fmt(ready)}
          </output>
        </span>
        <span className="mt-1.5 block text-sm text-white/65">
          Drag to see when each service would pick up and deliver on a weekday.
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={9}
        max={17}
        step={0.5}
        value={ready}
        onChange={(e) => setReady(Number(e.target.value))}
        aria-valuetext={fmt(ready)}
        className="mt-5 w-full accent-[#ee3823]"
      />

      <ul className="mt-6 space-y-5">
        {rows.map((r) => (
          <li key={r.name} className={r.available ? "" : "opacity-40"}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="font-semibold">{r.name}</span>
              <span className="text-sm tabular-nums text-white/70">{r.result}</span>
            </div>
            <div className="relative mt-2.5 h-2 rounded-full bg-white/10" aria-hidden>
              {r.available && (
                <>
                  <div
                    className="absolute inset-y-0 rounded-full bg-white/35"
                    style={{
                      left: pct(r.start),
                      width: `calc(${pct(r.windowStart)} - ${pct(r.start)})`,
                    }}
                  />
                  {r.pickupOnly ? (
                    <div
                      className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-ink"
                      style={{ left: pct(r.windowStart) }}
                    />
                  ) : (
                  <div
                    className="absolute inset-y-0 rounded-full bg-signal transition-[left,width] duration-200"
                    style={{
                      left: pct(r.windowStart),
                      width: `max(6px, calc(${pct(r.windowEnd)} - ${pct(r.windowStart)}))`,
                    }}
                  />
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="relative mt-3 h-5 text-xs text-white/50" aria-hidden>
        {ticks.map((h) => (
          <span
            key={h}
            className="absolute -translate-x-1/2 tabular-nums"
            style={{ left: pct(h) }}
          >
            {fmt(h)}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-4 text-sm text-white/65">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-white ring-2 ring-white/30" aria-hidden />
          Pickup
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-4 rounded-full bg-signal" aria-hidden />
          Delivery window
        </span>
      </div>
      <p className="mt-3 text-sm text-white/65">
        Drivers deliver after hours when a run needs it. Orders placed after
        6pm go out the next business day.
      </p>
    </div>
  );
}
