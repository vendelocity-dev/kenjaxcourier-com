import type { NextConfig } from "next";

// Static export for Cloudflare Pages. The form's email endpoint lives in
// /functions/api/quote.ts (a Cloudflare Pages Function), not in Next.js.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
