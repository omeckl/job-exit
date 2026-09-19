import { getDictionary } from "@/i18n";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { locale } = await params;
  const { redirectTo } = await searchParams;
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">{t.auth.loginTitle}</h1>
      <p className="text-sm text-neutral-600">{t.auth.loginText}</p>
      <LoginForm locale={locale} t={t} redirectTo={redirectTo ?? `/${locale}/dashboard`} />
    </div>
  );
}
