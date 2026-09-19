import Link from "next/link";
import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { consumeLoginToken } from "@/lib/auth";

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = getDictionary(locale);

  const record = token ? await consumeLoginToken(token) : null;
  if (record) redirect(record.redirectTo ?? `/${locale}/dashboard`);

  return (
    <div className="card mx-auto max-w-md text-center">
      <p className="text-sm text-neutral-700">{t.auth.invalid}</p>
      <Link href={`/${locale}/login`} className="btn-primary mt-3">
        {t.auth.loginTitle}
      </Link>
    </div>
  );
}
