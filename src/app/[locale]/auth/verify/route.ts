import { NextResponse, type NextRequest } from "next/server";
import { consumeLoginToken } from "@/lib/auth";
import { normalizeLocale } from "@/i18n";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const token = request.nextUrl.searchParams.get("token");
  const record = token ? await consumeLoginToken(token) : null;

  const target = record
    ? (record.redirectTo ?? `/${locale}/dashboard`)
    : `/${locale}/login?invalid=1`;

  return NextResponse.redirect(new URL(target, request.nextUrl.origin));
}
