import { getDictionary } from "@/i18n";
import { prisma } from "@/lib/prisma";
import { buildWhere, type SearchParams } from "@/lib/feed";
import ListingCard from "@/components/ListingCard";
import FeedFilters from "@/components/FeedFilters";
import SaveSearchButton from "@/components/SaveSearchButton";

export default async function FeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = getDictionary(locale);

  const listings = await prisma.listing.findMany({
    where: buildWhere(sp),
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { owner: { select: { fullName: true, photoUrl: true } } },
  });

  const query = new URLSearchParams(
    Object.entries(sp).flatMap(([key, value]) =>
      value === undefined ? [] : Array.isArray(value) ? value.map((v) => [key, v] as [string, string]) : [[key, value] as [string, string]],
    ),
  );
  query.delete("saved");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t.feed.title}</h1>
      <FeedFilters locale={locale} t={t} params={sp} />

      {sp.saved && (
        <p className="rounded-lg bg-[color:var(--color-brand-soft)] px-3 py-2 text-sm">
          {t.feed.searchSaved}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>
          {listings.length} {t.feed.results}
        </span>
        <SaveSearchButton locale={locale} label={t.feed.saveSearch} query={query.toString()} />
      </div>

      {listings.length === 0 ? (
        <p className="text-neutral-600">{t.feed.empty}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} locale={locale} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
