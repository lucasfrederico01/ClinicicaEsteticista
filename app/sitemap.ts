import type { MetadataRoute } from "next"
import { clinic } from "@/lib/content"
export default function sitemap(): MetadataRoute.Sitemap {
  return clinic.siteUrl
    ? [
        {
          url: clinic.siteUrl,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 1,
        },
      ]
    : []
}
