import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Kenjax Courier: same-day medical and Rx courier in Los Angeles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image() {
  const [font, logo] = await Promise.all([
    readFile(
      join(process.cwd(), "node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-500-normal.woff"),
    ),
    readFile(join(process.cwd(), "public/kenjax-logo-white.png"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e2f3a",
          color: "white",
          padding: 72,
          fontFamily: "Source Serif 4",
        }}
      >
        <img src={`data:image/png;base64,${logo}`} width={312} height={103} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 980 }}>
            Same-day medical courier for Los Angeles pharmacies, labs and clinics.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 36, color: "rgba(255,255,255,0.75)" }}>
            Call (866) 285-9477
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Source Serif 4", data: font, weight: 500, style: "normal" }] },
  );
}
