"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUser, getOrCreateUser, sendMagicLink } from "@/lib/auth";
import { buildSlug, listingStats } from "@/lib/listing";
import { sendClosingSummaryEmail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";

const listingSchema = z.object({
  displayMode: z.enum(["FIRST_NAME", "FULL_NAME"]),
  fullName: z.string().min(2).max(120),
  photoUrl: z.string().url().max(500).optional().or(z.literal("")),
  title: z.string().min(2).max(120),
  field: z.string().min(1),
  domain: z.string().min(1),
  country: z.string().min(1),
  city: z.string().max(80).optional().or(z.literal("")),
  workMode: z.enum(["ONSITE", "HYBRID", "REMOTE"]),
  workLanguages: z.array(z.string()).min(1),
  listingLanguage: z.string().min(1),
  lastWorkingDay: z.string().min(4),
  seniority: z.string().optional().or(z.literal("")),
  experienceNeeded: z.string().max(200).optional().or(z.literal("")),
  employmentType: z.string().optional().or(z.literal("")),
  schedule: z.string().optional().or(z.literal("")),
  hasReports: z.boolean(),
  reportCount: z.number().int().min(0).max(10000).optional(),
  travel: z.string().max(200).optional().or(z.literal("")),
  officeDays: z.number().int().min(0).max(7).optional(),
  remoteLimit: z.string().max(200).optional().or(z.literal("")),
  salary: z.string().max(200).optional().or(z.literal("")),
  benefits: z.array(z.string()),
  tasks: z.array(z.string()).max(7),
  techTags: z.array(z.string()),
  goodParts: z.string().max(600).optional().or(z.literal("")),
  hardParts: z.string().max(600).optional().or(z.literal("")),
  teamSize: z.string().max(100).optional().or(z.literal("")),
  reportsTo: z.string().max(120).optional().or(z.literal("")),
  companyName: z.string().max(120).optional().or(z.literal("")),
  companyUrl: z.string().url().max(300).optional().or(z.literal("")),
  companyDescription: z.string().max(600).optional().or(z.literal("")),
  industry: z.string().optional().or(z.literal("")),
  companySize: z.string().optional().or(z.literal("")),
  applicantPrompt: z.string().max(300).optional().or(z.literal("")),
  dealbreakers: z.array(z.string()),
});

function list(value: FormDataEntryValue | null, separator: RegExp | string) {
  return String(value ?? "")
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalInt(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && String(value ?? "").trim() !== "" ? parsed : undefined;
}

function parseForm(formData: FormData) {
  return listingSchema.safeParse({
    displayMode: String(formData.get("displayMode") ?? "FIRST_NAME"),
    fullName: String(formData.get("fullName") ?? ""),
    photoUrl: String(formData.get("photoUrl") ?? ""),
    title: String(formData.get("title") ?? ""),
    field: String(formData.get("field") ?? ""),
    domain: String(formData.get("domain") ?? ""),
    country: String(formData.get("country") ?? ""),
    city: String(formData.get("city") ?? ""),
    workMode: String(formData.get("workMode") ?? "ONSITE"),
    workLanguages: formData.getAll("workLanguages").map(String),
    listingLanguage: String(formData.get("listingLanguage") ?? ""),
    lastWorkingDay: String(formData.get("lastWorkingDay") ?? ""),
    seniority: String(formData.get("seniority") ?? ""),
    experienceNeeded: String(formData.get("experienceNeeded") ?? ""),
    employmentType: String(formData.get("employmentType") ?? ""),
    schedule: String(formData.get("schedule") ?? ""),
    hasReports: formData.get("hasReports") === "on",
    reportCount: optionalInt(formData.get("reportCount")),
    travel: String(formData.get("travel") ?? ""),
    officeDays: optionalInt(formData.get("officeDays")),
    remoteLimit: String(formData.get("remoteLimit") ?? ""),
    salary: String(formData.get("salary") ?? ""),
    benefits: list(formData.get("benefits"), ","),
    tasks: list(formData.get("tasks"), /\r?\n/),
    techTags: formData.getAll("techTags").map(String),
    goodParts: String(formData.get("goodParts") ?? ""),
    hardParts: String(formData.get("hardParts") ?? ""),
    teamSize: String(formData.get("teamSize") ?? ""),
    reportsTo: String(formData.get("reportsTo") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    companyUrl: String(formData.get("companyUrl") ?? ""),
    companyDescription: String(formData.get("companyDescription") ?? ""),
    industry: String(formData.get("industry") ?? ""),
    companySize: String(formData.get("companySize") ?? ""),
    applicantPrompt: String(formData.get("applicantPrompt") ?? ""),
    dealbreakers: list(formData.get("dealbreakers"), ","),
  });
}

function toData(input: z.infer<typeof listingSchema>) {
  const empty = (value?: string) => (value && value.length > 0 ? value : null);
  return {
    displayMode: input.displayMode,
    title: input.title,
    field: input.field,
    domain: input.domain,
    country: input.country,
    city: input.workMode === "REMOTE" ? empty(input.city) : empty(input.city),
    workMode: input.workMode,
    workLanguages: input.workLanguages,
    listingLanguage: input.listingLanguage,
    lastWorkingDay: new Date(input.lastWorkingDay),
    seniority: empty(input.seniority),
    experienceNeeded: empty(input.experienceNeeded),
    employmentType: empty(input.employmentType),
    schedule: empty(input.schedule),
    hasReports: input.hasReports,
    reportCount: input.reportCount ?? null,
    travel: empty(input.travel),
    officeDays: input.officeDays ?? null,
    remoteLimit: empty(input.remoteLimit),
    salary: empty(input.salary),
    benefits: input.benefits,
    tasks: input.tasks,
    techTags: input.techTags,
    goodParts: empty(input.goodParts),
    hardParts: empty(input.hardParts),
    teamSize: empty(input.teamSize),
    reportsTo: empty(input.reportsTo),
    companyName: empty(input.companyName),
    companyUrl: empty(input.companyUrl),
    companyDescription: empty(input.companyDescription),
    industry: empty(input.industry),
    companySize: empty(input.companySize),
    applicantPrompt: empty(input.applicantPrompt),
    dealbreakers: input.dealbreakers,
  };
}

export type ListingFormState = { error?: string; emailSent?: boolean } | null;

export async function createListingAction(
  _state: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const locale = String(formData.get("locale") ?? "hu");
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: "invalid" };

  const signedIn = await currentUser();
  const email = signedIn?.email ?? String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "invalid_email" };
  if (!rateLimit(`listing:${email}`, 5, 24 * 60 * 60 * 1000).allowed) return { error: "rate_limited" };

  const user = signedIn ?? (await getOrCreateUser(email));
  if (user.isBanned) return { error: "banned" };

  const activeListing = await prisma.listing.findFirst({
    where: { ownerId: user.id, status: "ACTIVE" },
  });
  if (activeListing) return { error: "already_active" };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      fullName: parsed.data.fullName,
      photoUrl: parsed.data.photoUrl || null,
      locale,
    },
  });

  const created = await prisma.listing.create({
    data: { ...toData(parsed.data), ownerId: user.id, slug: "pending" },
  });
  const listing = await prisma.listing.update({
    where: { id: created.id },
    data: { slug: buildSlug(parsed.data.title, parsed.data.city || null, created.ref) },
  });

  if (!signedIn) {
    await sendMagicLink(email, `/${locale}/dashboard`, locale);
    return { emailSent: true };
  }

  revalidatePath(`/${locale}/positions`);
  redirect(`/${locale}/h/${listing.slug}`);
}

export async function updateListingAction(
  _state: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const locale = String(formData.get("locale") ?? "hu");
  const id = String(formData.get("id") ?? "");
  const user = await currentUser();
  if (!user) return { error: "unauthorized" };

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: "invalid" };

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.ownerId !== user.id) return { error: "unauthorized" };

  await prisma.user.update({
    where: { id: user.id },
    data: { fullName: parsed.data.fullName, photoUrl: parsed.data.photoUrl || null },
  });

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      ...toData(parsed.data),
      slug: buildSlug(parsed.data.title, parsed.data.city || null, listing.ref),
    },
  });

  revalidatePath(`/${locale}/h/${updated.slug}`);
  redirect(`/${locale}/h/${updated.slug}`);
}

export async function closeListingAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "hu");
  const id = String(formData.get("id") ?? "");
  const foundSuccessor = formData.get("foundSuccessor") === "yes";
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login`);

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.ownerId !== user.id) redirect(`/${locale}/dashboard`);

  const stats = await listingStats(listing.id);
  await prisma.listing.update({
    where: { id },
    data: { status: "CLOSED", closedAt: new Date(), foundSuccessor },
  });
  await sendClosingSummaryEmail(user.email, listing.title, stats, locale);

  revalidatePath(`/${locale}/positions`);
  redirect(`/${locale}/dashboard/closed?id=${listing.id}`);
}

export async function deleteListingAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "hu");
  const id = String(formData.get("id") ?? "");
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login`);

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.ownerId !== user.id) redirect(`/${locale}/dashboard`);

  await prisma.listing.update({
    where: { id },
    data: {
      status: "CLOSED",
      contentDeleted: true,
      closedAt: listing.closedAt ?? new Date(),
      tasks: [],
      techTags: [],
      benefits: [],
      dealbreakers: [],
      goodParts: null,
      hardParts: null,
      companyName: null,
      companyUrl: null,
      companyDescription: null,
      salary: null,
      applicantPrompt: null,
    },
  });

  revalidatePath(`/${locale}/positions`);
  redirect(`/${locale}/dashboard`);
}
