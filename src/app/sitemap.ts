import { MetadataRoute } from "next";
import { readSeoSettings } from "@/utils/seoSettings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pinsk-elektrik.by";
  const seo = await readSeoSettings();
  const canonicalUrl = new URL(seo.canonicalPath, siteUrl).toString();
  const pricesUrl = new URL("/prices", siteUrl).toString();
  const privacyUrl = new URL("/privacy", siteUrl).toString();
  const offerUrl = new URL("/offer", siteUrl).toString();

  return [
    {
      url: canonicalUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: pricesUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: privacyUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: offerUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
