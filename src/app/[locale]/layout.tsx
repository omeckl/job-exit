import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/i18n";
import { currentUser } from "@/lib/auth";
import LocaleSwitch from "@/components/LocaleSwitch";
import LogoutButton from "@/components/LogoutButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return {
    title: { default: `${t.meta.siteName} — ${t.meta.tagline}`, template: `%s — ${t.meta.siteName}` },
    description: t.meta.description,
    openGraph: {
      title: `${t.meta.siteName} — ${t.meta.tagline}`,
      description: t.meta.description,
      images: ["/og-default.png"],
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link href={`/${locale}`} className="text-base font-semibold">
            {t.meta.siteName}
          </Link>
          <nav className="flex flex-1 flex-wrap items-center gap-4 text-sm text-neutral-700">
            <Link href={`/${locale}/positions`}>{t.nav.feed}</Link>
            <Link href={`/${locale}/about`}>{t.nav.about}</Link>
            {user && <Link href={`/${locale}/dashboard`}>{t.nav.myListing}</Link>}
            {user && <Link href={`/${locale}/applications`}>{t.nav.myApplications}</Link>}
            {user?.isAdmin && <Link href={`/${locale}/admin`}>{t.nav.admin}</Link>}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <LocaleSwitch locale={locale} />
            {user ? (
              <LogoutButton label={t.nav.logout} locale={locale} />
            ) : (
              <Link href={`/${locale}/login`}>{t.nav.login}</Link>
            )}
            <Link href={`/${locale}/new`} className="btn-primary">
              {t.nav.postListing}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-4 px-4 py-6 text-sm text-neutral-600">
          <Link href={`/${locale}/about`}>{t.footer.about}</Link>
          <Link href={`/${locale}/terms`}>{t.footer.terms}</Link>
          <Link href={`/${locale}/privacy`}>{t.footer.privacy}</Link>
          <Link href={`/${locale}/cookies`}>{t.footer.cookies}</Link>
          <a href="mailto:hello@utodom.hu">{t.footer.contact}: hello@utodom.hu</a>
        </div>
      </footer>
    </div>
  );
}
