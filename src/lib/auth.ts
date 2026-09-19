import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendLoginEmail } from "@/lib/email";

const SESSION_COOKIE = "utodom_session";
const SESSION_DAYS = 60;
const TOKEN_MINUTES = 30;

function hash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function appUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

export async function getOrCreateUser(email: string) {
  const normalized = email.trim().toLowerCase();
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return prisma.user.upsert({
    where: { email: normalized },
    update: {},
    create: { email: normalized, isAdmin: adminEmails.includes(normalized) },
  });
}

export async function createLoginLink(userId: string, redirectTo: string, locale: string) {
  const token = randomBytes(32).toString("hex");
  await prisma.loginToken.create({
    data: {
      tokenHash: hash(token),
      userId,
      redirectTo,
      expiresAt: new Date(Date.now() + TOKEN_MINUTES * 60 * 1000),
    },
  });
  return `${appUrl()}/${locale}/auth/verify?token=${token}`;
}

export async function sendMagicLink(email: string, redirectTo: string, locale: string) {
  const user = await getOrCreateUser(email);
  if (user.isBanned) return { banned: true as const };
  const link = await createLoginLink(user.id, redirectTo, locale);
  await sendLoginEmail(user.email, link, locale);
  return { banned: false as const, user };
}

export async function consumeLoginToken(token: string) {
  const record = await prisma.loginToken.findUnique({
    where: { tokenHash: hash(token) },
    include: { user: true },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) return null;
  await prisma.loginToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });
  if (record.user.isBanned) return null;
  if (!record.user.emailVerifiedAt) {
    await prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } });
  }
  await startSession(record.userId);
  return record;
}

export async function startSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { tokenHash: hash(token), userId, expiresAt } });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hash(token) } });
  store.delete(SESSION_COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hash(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date() || session.user.isBanned) return null;
  return session.user;
}
