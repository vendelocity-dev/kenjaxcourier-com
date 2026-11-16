import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = ["", "/medical-delivery", "/same-day", "/about", "/contact", "/quote"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : r === "/medical-delivery" ? 0.9 : 0.7,
  }));
}
