import type { MetadataRoute } from "next"
import { clinic } from "@/lib/content"
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(clinic.siteUrl ? { allow: "/" } : { disallow: "/" }),
    },
    ...(clinic.siteUrl ? { sitemap: `${clinic.siteUrl}/sitemap.xml` } : {}),
  }
}
