import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/auth";
import { LOCALES } from "@/lib/taxonomy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = appUrl();
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE", hiddenByAdmin: false, owner: { emailVerifiedAt: { not: null } } },
    select: { slug: true, updatedAt: true },
    take: 1000,
  });

  const staticPaths = ["", "/positions", "/about", "/terms", "/privacy", "/cookies"];

  return [
    ...LOCALES.flatMap((locale) =>
      staticPaths.map((path) => ({ url: `${base}/${locale}${path}`, lastModified: new Date() })),
    ),
    ...LOCALES.flatMap((locale) =>
      listings.map((listing) => ({
        url: `${base}/${locale}/h/${listing.slug}`,
        lastModified: listing.updatedAt,
      })),
    ),
  ];
}
