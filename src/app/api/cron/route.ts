import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/auth";
import { sendClosingReminderEmail, sendClosingSummaryEmail, sendDigestEmail } from "@/lib/email";
import { listingStats } from "@/lib/listing";

const DAY = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided =
    request.headers.get("authorization")?.replace("Bearer ", "") ??
    request.nextUrl.searchParams.get("secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const reminderDue = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      reminderSentAt: null,
      lastWorkingDay: { lte: new Date(now.getTime() + 23 * DAY) },
    },
    include: { owner: true },
    take: 200,
  });
  for (const listing of reminderDue) {
    await sendClosingReminderEmail(
      listing.owner.email,
      listing.title,
      `${appUrl()}/${listing.owner.locale}/dashboard`,
      listing.owner.locale,
    );
    await prisma.listing.update({ where: { id: listing.id }, data: { reminderSentAt: now } });
  }

  const closeDue = await prisma.listing.findMany({
    where: { status: "ACTIVE", lastWorkingDay: { lte: new Date(now.getTime() - 30 * DAY) } },
    include: { owner: true },
    take: 200,
  });
  for (const listing of closeDue) {
    const stats = await listingStats(listing.id);
    await prisma.listing.update({
      where: { id: listing.id },
      data: { status: "CLOSED", closedAt: now },
    });
    await sendClosingSummaryEmail(listing.owner.email, listing.title, stats, listing.owner.locale);
  }

  const searches = await prisma.savedSearch.findMany({ include: { user: true }, take: 500 });
  let digests = 0;
  for (const search of searches) {
    const since = search.lastSentAt ?? new Date(now.getTime() - DAY);
    if (now.getTime() - since.getTime() < DAY) continue;

    const params = new URLSearchParams(search.query);
    const title = params.get("q") ?? undefined;
    const listings = await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        hiddenByAdmin: false,
        createdAt: { gte: since },
        owner: { emailVerifiedAt: { not: null } },
        ...(title ? { title: { contains: title, mode: "insensitive" as const } } : {}),
      },
      take: 20,
    });
    await prisma.savedSearch.update({ where: { id: search.id }, data: { lastSentAt: now } });
    if (listings.length === 0) continue;

    await sendDigestEmail(
      search.user.email,
      listings.map((listing) => `${listing.title} — ${appUrl()}/${search.user.locale}/h/${listing.slug}`),
      `${appUrl()}/${search.user.locale}/positions?${search.query}`,
      search.user.locale,
    );
    digests += 1;
  }

  return NextResponse.json({
    reminders: reminderDue.length,
    closed: closeDue.length,
    digests,
  });
}
