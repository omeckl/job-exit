import Link from "next/link";
import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { listingStats } from "@/lib/listing";

export default async function ClosedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  const { id } = await searchParams;
  const t = getDictionary(locale);
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login`);

  const listing = id ? await prisma.listing.findUnique({ where: { id } }) : null;
  if (!listing || listing.ownerId !== user.id) redirect(`/${locale}/dashboard`);

  const stats = await listingStats(listing.id);

  return (
    <div className="card mx-auto max-w-xl space-y-4 text-center">
      <h1 className="text-xl font-semibold">{t.dashboard.closeDone}</h1>
      <p className="text-sm text-neutral-600">{t.dashboard.closeSummary}</p>
      <div className="grid grid-cols-3 gap-4">
        {[
          [stats.views, t.listing.views],
          [stats.applications, t.listing.applications],
          [stats.handovers, t.listing.handovers],
        ].map(([number, label]) => (
          <div key={String(label)} className="rounded-lg bg-[color:var(--color-brand-soft)] p-4">
            <p className="text-2xl font-semibold text-[color:var(--color-brand)]">{number}</p>
            <p className="text-xs text-neutral-600">{label}</p>
          </div>
        ))}
      </div>
      <Link href={`/${locale}/positions`} className="btn-primary">
        {t.listing.backToFeed}
      </Link>
    </div>
  );
}
