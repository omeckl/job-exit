import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/auth";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/hu/admin", "/en/admin"] }],
    sitemap: `${appUrl()}/sitemap.xml`,
  };
}
