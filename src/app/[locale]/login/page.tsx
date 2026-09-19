import { getDictionary } from "@/i18n";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirectTo?: string; invalid?: string }>;
}) {
  const { locale } = await params;
  const { redirectTo, invalid } = await searchParams;
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">{t.auth.loginTitle}</h1>
      {invalid ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{t.auth.invalid}</p>
      ) : null}
      <p className="text-sm text-neutral-600">{t.auth.loginText}</p>
      <LoginForm locale={locale} t={t} redirectTo={redirectTo ?? `/${locale}/dashboard`} />
    </div>
  );
}
