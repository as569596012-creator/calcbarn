import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { CALCULATORS } from "@/lib/calculators";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["/", "/about/", "/contact/", "/privacy/", "/disclaimer/"];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: absoluteUrl(p),
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : 0.5,
  }));

  const calcEntries: MetadataRoute.Sitemap = CALCULATORS.map((c) => ({
    url: absoluteUrl(`/${c.slug}/`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticEntries, ...calcEntries];
}
