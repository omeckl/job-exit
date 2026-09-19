import Link from "next/link";
import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { listingStats } from "@/lib/listing";
import { closeListingAction, deleteListingAction } from "@/app/actions/listings";
import HandoverForm from "@/components/HandoverForm";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login`);

  const listing = await prisma.listing.findFirst({
    where: { ownerId: user.id, status: "ACTIVE" },
    include: { applications: { include: { applicant: true }, orderBy: { createdAt: "desc" } } },
  });

  if (!listing) {
    return (
      <div className="card">
        <p className="text-neutral-700">{t.dashboard.noListing}</p>
        <Link href={`/${locale}/new`} className="btn-primary mt-3">
          {t.dashboard.createListing}
        </Link>
      </div>
    );
  }

  const stats = await listingStats(listing.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{listing.title}</h1>
          <p className="text-sm text-neutral-600">
            {stats.views} {t.listing.views} · {stats.applications} {t.listing.applications} · {stats.handovers}{" "}
            {t.listing.handovers}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/${locale}/h/${listing.slug}`} className="btn-secondary">
            {t.nav.feed}
          </Link>
          <Link href={`/${locale}/dashboard/edit`} className="btn-secondary">
            {t.dashboard.edit}
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          {t.dashboard.applicants} ({listing.applications.length})
        </h2>
        {listing.applications.length === 0 ? (
          <p className="text-neutral-600">{t.dashboard.noApplicants}</p>
        ) : (
          listing.applications.map((application) => (
            <div key={application.id} className="card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium">{application.applicant.fullName ?? application.applicant.email}</span>
                <span className="text-neutral-500">{application.createdAt.toISOString().slice(0, 10)}</span>
              </div>
              <p className="whitespace-pre-line text-sm text-neutral-700">{application.intro}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href={application.linkedinUrl} className="text-[color:var(--color-brand)] underline">
                  LinkedIn
                </a>
                <a href={`mailto:${application.applicant.email}`} className="text-neutral-600">
                  {application.applicant.email}
                </a>
                {application.salaryExpectation && (
                  <span className="text-neutral-600">
                    {t.apply.salaryExpectation}: {application.salaryExpectation}
                  </span>
                )}
                {application.noticePeriod && (
                  <span className="text-neutral-600">
                    {t.apply.noticePeriod}: {application.noticePeriod}
                  </span>
                )}
              </div>

              {application.handoverSentAt ? (
                <p className="text-sm text-[color:var(--color-brand)]">{t.dashboard.handoverSent}</p>
              ) : (
                <HandoverForm
                  locale={locale}
                  applicationId={application.id}
                  openLabel={t.dashboard.sendHandover}
                  title={t.dashboard.handoverTitle}
                  help={t.dashboard.handoverHelp}
                  sendLabel={t.dashboard.handoverSend}
                  cancelLabel={t.common.cancel}
                />
              )}
            </div>
          ))
        )}
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold">{t.dashboard.closeTitle}</h2>
        <form action={closeListingAction} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="id" value={listing.id} />
          <span className="text-sm text-neutral-700">{t.dashboard.closeQuestion}</span>
          <button type="submit" name="foundSuccessor" value="yes" className="btn-primary">
            {t.dashboard.yes}
          </button>
          <button type="submit" name="foundSuccessor" value="no" className="btn-secondary">
            {t.dashboard.no}
          </button>
        </form>

        <form action={deleteListingAction}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="id" value={listing.id} />
          <button type="submit" className="text-sm text-red-600 underline">
            {t.dashboard.delete}
          </button>
        </form>
      </section>
    </div>
  );
}
