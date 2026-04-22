import { MetadataRoute } from "next";
import { readSeoSettings } from "@/utils/seoSettings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://electro-pinsk.by";
  const seo = await readSeoSettings();

  return {
    rules: [
      {
        userAgent: "*",
        allow: seo.indexingEnabled ? "/" : [],
        disallow: seo.indexingEnabled ? ["/api/"] : ["/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
