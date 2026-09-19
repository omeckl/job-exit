"use server";

import { redirect } from "next/navigation";
import { endSession, sendMagicLink } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

export async function logoutAction(locale: string) {
  await endSession();
  redirect(`/${locale}`);
}

export async function requestLoginLinkAction(
  _state: { sent: boolean; error?: string } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim();
  const locale = String(formData.get("locale") ?? "hu");
  const redirectTo = String(formData.get("redirectTo") ?? `/${locale}/dashboard`);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { sent: false, error: "invalid_email" };
  }
  if (!rateLimit(`login:${email.toLowerCase()}`, 5, 60 * 60 * 1000).allowed) {
    return { sent: false, error: "rate_limited" };
  }

  const result = await sendMagicLink(email, redirectTo, locale);
  if (result.banned) return { sent: false, error: "banned" };
  return { sent: true };
}
