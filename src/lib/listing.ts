import { prisma } from "@/lib/prisma";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function buildSlug(title: string, city: string | null, ref: number) {
  const base = [slugify(title), city ? slugify(city) : ""].filter(Boolean).join("-");
  return `${base || "pozicio"}-${ref}`;
}

export function daysUntil(date: Date) {
  return Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

export function autoCloseDate(lastWorkingDay: Date) {
  return new Date(lastWorkingDay.getTime() + 30 * 24 * 60 * 60 * 1000);
}

export async function listingStats(listingId: string) {
  const [applications, handovers, listing] = await Promise.all([
    prisma.application.count({ where: { listingId } }),
    prisma.application.count({ where: { listingId, handoverSentAt: { not: null } } }),
    prisma.listing.findUnique({ where: { id: listingId }, select: { viewCount: true } }),
  ]);
  return { applications, handovers, views: listing?.viewCount ?? 0 };
}
