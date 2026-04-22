import { MetadataRoute } from "next";
import { readSeoSettings } from "@/utils/seoSettings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://electro-pinsk.by";
  const seo = await readSeoSettings();
  const canonicalUrl = new URL(seo.canonicalPath, siteUrl).toString();

  return [
    {
      url: canonicalUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
