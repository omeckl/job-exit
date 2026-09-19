"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { appUrl, currentUser, getOrCreateUser, sendMagicLink } from "@/lib/auth";
import { sendHandoverEmail, sendNewApplicationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";

const applicationSchema = z.object({
  linkedinUrl: z.string().url().max(300),
  intro: z.string().min(200).max(1500),
  salaryExpectation: z.string().max(200).optional().or(z.literal("")),
  noticePeriod: z.string().max(200).optional().or(z.literal("")),
});

export type ApplyState = { error?: string; emailSent?: boolean; done?: boolean } | null;

export async function applyAction(_state: ApplyState, formData: FormData): Promise<ApplyState> {
  const locale = String(formData.get("locale") ?? "hu");
  const listingId = String(formData.get("listingId") ?? "");

  const parsed = applicationSchema.safeParse({
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
    intro: String(formData.get("intro") ?? ""),
    salaryExpectation: String(formData.get("salaryExpectation") ?? ""),
    noticePeriod: String(formData.get("noticePeriod") ?? ""),
  });
  if (!parsed.success) return { error: "invalid" };

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { owner: true },
  });
  if (!listing || listing.status !== "ACTIVE" || listing.hiddenByAdmin) return { error: "closed" };

  const signedIn = await currentUser();
  const email = signedIn?.email ?? String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "invalid_email" };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`apply-ip:${ip}`, 20, 60 * 60 * 1000).allowed) return { error: "limit" };

  const user = signedIn ?? (await getOrCreateUser(email));
  if (user.isBanned) return { error: "banned" };
  if (user.id === listing.ownerId) return { error: "own_listing" };

  const existing = await prisma.application.findUnique({
    where: { listingId_applicantId: { listingId, applicantId: user.id } },
  });
  if (existing) return { error: "already_applied" };

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [daily, weekly] = await Promise.all([
    prisma.application.count({ where: { applicantId: user.id, createdAt: { gte: dayAgo } } }),
    prisma.application.count({ where: { applicantId: user.id, createdAt: { gte: weekAgo } } }),
  ]);
  if (daily >= 5 || weekly >= 20) return { error: "limit" };

  await prisma.application.create({
    data: {
      listingId,
      applicantId: user.id,
      linkedinUrl: parsed.data.linkedinUrl,
      intro: parsed.data.intro,
      salaryExpectation: parsed.data.salaryExpectation || null,
      noticePeriod: parsed.data.noticePeriod || null,
    },
  });

  if (!signedIn) {
    await sendMagicLink(email, `/${locale}/applications`, locale);
    return { emailSent: true };
  }

  await sendNewApplicationEmail(
    listing.owner.email,
    listing.title,
    `${appUrl()}/${locale}/dashboard`,
    listing.owner.locale,
  );
  revalidatePath(`/${locale}/applications`);
  return { done: true };
}

export async function sendHandoverAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "hu");
  const applicationId = String(formData.get("applicationId") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login`);
  if (message.length < 10) redirect(`/${locale}/dashboard`);

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { listing: true, applicant: true },
  });
  if (!application || application.listing.ownerId !== user.id) redirect(`/${locale}/dashboard`);

  await prisma.application.update({
    where: { id: applicationId },
    data: { handoverMessage: message, handoverSentAt: new Date() },
  });

  await sendHandoverEmail(
    application.applicant.email,
    application.listing.title,
    message,
    user.fullName ?? user.email,
    user.email,
    application.applicant.locale,
  );

  revalidatePath(`/${locale}/dashboard`);
  redirect(`/${locale}/dashboard`);
}

export async function saveSearchAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "hu");
  const query = String(formData.get("query") ?? "");
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login?redirectTo=${encodeURIComponent(`/${locale}/positions?${query}`)}`);

  await prisma.savedSearch.create({ data: { userId: user.id, query } });
  redirect(`/${locale}/positions?${query}&saved=1`);
}
