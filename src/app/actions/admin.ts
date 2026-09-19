"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

async function requireAdmin() {
  const user = await currentUser();
  if (!user?.isAdmin) throw new Error("forbidden");
  return user;
}

export async function toggleListingHiddenAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return;
  await prisma.listing.update({ where: { id }, data: { hiddenByAdmin: !listing.hiddenByAdmin } });
  revalidatePath(`/${String(formData.get("locale") ?? "hu")}/admin`);
}

export async function toggleUserBannedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return;
  await prisma.user.update({ where: { id }, data: { isBanned: !user.isBanned } });
  revalidatePath(`/${String(formData.get("locale") ?? "hu")}/admin`);
}

export async function addTagAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "other").trim();
  if (!name) return;
  await prisma.techTag.upsert({ where: { name }, update: { category }, create: { name, category } });
  revalidatePath(`/${String(formData.get("locale") ?? "hu")}/admin`);
}

export async function deleteTagAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.techTag.delete({ where: { id } }).catch(() => null);
  revalidatePath(`/${String(formData.get("locale") ?? "hu")}/admin`);
}

export async function addCityAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const country = String(formData.get("country") ?? "HU").trim();
  if (!name) return;
  await prisma.city
    .upsert({ where: { name_country: { name, country } }, update: {}, create: { name, country } })
    .catch(() => null);
  revalidatePath(`/${String(formData.get("locale") ?? "hu")}/admin`);
}

export async function deleteCityAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.city.delete({ where: { id } }).catch(() => null);
  revalidatePath(`/${String(formData.get("locale") ?? "hu")}/admin`);
}
