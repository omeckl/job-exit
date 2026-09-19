import Link from "next/link";
import { getDictionary } from "@/i18n";
import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      hiddenByAdmin: false,
      owner: { emailVerifiedAt: { not: null }, isBanned: false },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { owner: { select: { fullName: true, photoUrl: true } } },
  });

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold sm:text-4xl">{t.home.heroTitle}</h1>
        <p className="max-w-2xl text-neutral-600">{t.home.heroText}</p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${locale}/new`} className="btn-primary">
            {t.home.ctaPost}
          </Link>
          <Link href={`/${locale}/positions`} className="btn-secondary">
            {t.home.ctaSearch}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          [t.home.step1Title, t.home.step1Text],
          [t.home.step2Title, t.home.step2Text],
          [t.home.step3Title, t.home.step3Text],
        ].map(([title, text]) => (
          <div key={title} className="card">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-neutral-600">{text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t.home.latest}</h2>
          <Link href={`/${locale}/positions`} className="text-sm text-[color:var(--color-brand)]">
            {t.nav.feed}
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="card text-center">
            <p className="font-medium">{t.home.emptyTitle}</p>
            <p className="mt-1 text-sm text-neutral-600">{t.home.emptyText}</p>
            <Link href={`/${locale}/new`} className="btn-primary mt-4">
              {t.home.ctaPost}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} locale={locale} t={t} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
