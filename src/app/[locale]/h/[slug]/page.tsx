import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, vacancyLabel } from "@/i18n";
import { prisma } from "@/lib/prisma";
import { currentUser, appUrl } from "@/lib/auth";
import { daysUntil } from "@/lib/listing";
import Avatar from "@/components/Avatar";
import ShareBox from "@/components/ShareBox";
import ApplyForm from "@/components/ApplyForm";
import { firstNameOf } from "@/components/ListingCard";

async function getListing(slug: string) {
  return prisma.listing.findUnique({
    where: { slug },
    include: { owner: { select: { id: true, fullName: true, photoUrl: true, emailVerifiedAt: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const listing = await getListing(slug);
  const t = getDictionary(locale);
  if (!listing) return { title: t.listing.closedTitle };
  return {
    title: listing.title,
    description: listing.tasks[0] ?? t.meta.description,
    openGraph: {
      title: `${listing.title} — ${listing.companyName ?? t.listing.anonymous}`,
      description: listing.tasks[0] ?? t.meta.description,
      images: ["/og-default.png"],
      url: `${appUrl()}/${locale}/h/${listing.slug}`,
    },
  };
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-neutral-100 py-2 text-sm last:border-0">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const listing = await getListing(slug);
  if (!listing) notFound();

  const user = await currentUser();
  const isOwner = user?.id === listing.ownerId;
  const unavailable =
    listing.status === "CLOSED" || listing.hiddenByAdmin || !listing.owner.emailVerifiedAt;

  if (unavailable && !isOwner) {
    return (
      <div className="card mx-auto max-w-xl text-center">
        <h1 className="text-xl font-semibold">{t.listing.closedTitle}</h1>
        <p className="mt-2 text-neutral-600">{t.listing.closedText}</p>
        <Link href={`/${locale}/positions`} className="btn-primary mt-4">
          {t.listing.backToFeed}
        </Link>
      </div>
    );
  }

  if (!isOwner) {
    await prisma.listing.update({ where: { id: listing.id }, data: { viewCount: { increment: 1 } } });
  }

  const displayName =
    listing.displayMode === "FULL_NAME" ? listing.owner.fullName : firstNameOf(listing.owner.fullName);
  const place =
    listing.workMode === "REMOTE"
      ? t.listing.remote
      : [listing.city, listing.workMode === "HYBRID" ? t.listing.hybrid : t.listing.onsite]
          .filter(Boolean)
          .join(" · ");
  const url = `${appUrl()}/${locale}/h/${listing.slug}`;
  const alreadyApplied = user
    ? Boolean(
        await prisma.application.findUnique({
          where: { listingId_applicantId: { listingId: listing.id, applicantId: user.id } },
        }),
      )
    : false;

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">{listing.title}</h1>
        <p className="text-neutral-600">
          {listing.companyName ?? t.listing.anonymous} · {place} ·{" "}
          {t.fields[listing.field as keyof typeof t.fields] ?? listing.field}
        </p>
        <p className="font-medium text-[color:var(--color-brand)]">
          {vacancyLabel(t, daysUntil(listing.lastWorkingDay))} ({t.listing.lastWorkingDay}:{" "}
          {listing.lastWorkingDay.toISOString().slice(0, 10)})
        </p>
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <Avatar name={displayName} photoUrl={listing.owner.photoUrl} />
          <span>
            {t.listing.postedBy}: {displayName}
          </span>
          <span>
            · {listing.viewCount} {t.listing.views}
          </span>
        </div>
        <ShareBox
          url={url}
          title={listing.title}
          shareLabel={t.listing.share}
          copyLabel={t.listing.copyPost}
          copiedLabel={t.listing.copied}
          locale={locale}
        />
      </header>

      {listing.tasks.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">{t.listing.tasks}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
            {listing.tasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </section>
      )}

      {listing.techTags.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">{t.listing.tech}</h2>
          <div className="flex flex-wrap gap-2">
            {listing.techTags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {listing.goodParts && (
          <section className="card">
            <h2 className="mb-1 font-semibold">{t.listing.good}</h2>
            <p className="text-sm text-neutral-700">{listing.goodParts}</p>
          </section>
        )}
        {listing.hardParts && (
          <section className="card">
            <h2 className="mb-1 font-semibold">{t.listing.hard}</h2>
            <p className="text-sm text-neutral-700">{listing.hardParts}</p>
          </section>
        )}
      </div>

      <section className="card">
        <Row label={t.listing.seniority} value={listing.seniority ? t.enums[listing.seniority as keyof typeof t.enums] : null} />
        <Row label={t.listing.experience} value={listing.experienceNeeded} />
        <Row
          label={t.listing.employmentType}
          value={listing.employmentType ? t.enums[listing.employmentType as keyof typeof t.enums] : null}
        />
        <Row label={t.listing.schedule} value={listing.schedule ? t.enums[listing.schedule as keyof typeof t.enums] : null} />
        <Row label={t.listing.travel} value={listing.travel} />
        <Row label={t.listing.officeDays} value={listing.officeDays ? String(listing.officeDays) : null} />
        <Row label={t.listing.reports} value={listing.hasReports ? String(listing.reportCount ?? "") || t.common.yes : null} />
        <Row label={t.listing.team} value={listing.teamSize} />
        <Row label={t.listing.reportsTo} value={listing.reportsTo} />
        <Row label={t.listing.salary} value={listing.salary} />
        <Row label={t.listing.benefits} value={listing.benefits.join(", ") || null} />
        <Row
          label={t.listing.workLanguages}
          value={listing.workLanguages.map((lang) => t.enums[lang as keyof typeof t.enums] ?? lang).join(", ")}
        />
        <Row
          label={t.listing.listingLanguage}
          value={t.enums[listing.listingLanguage as keyof typeof t.enums] ?? listing.listingLanguage}
        />
        <Row label={t.listing.industry} value={listing.industry} />
        <Row
          label={t.listing.companySize}
          value={listing.companySize ? t.enums[listing.companySize as keyof typeof t.enums] : null}
        />
      </section>

      {(listing.companyDescription || listing.companyUrl) && (
        <section className="card">
          <h2 className="mb-1 font-semibold">{t.listing.company}</h2>
          {listing.companyDescription && (
            <p className="text-sm text-neutral-700">{listing.companyDescription}</p>
          )}
          {listing.companyUrl && (
            <a href={listing.companyUrl} className="text-sm text-[color:var(--color-brand)] underline">
              {listing.companyUrl}
            </a>
          )}
        </section>
      )}

      {listing.dealbreakers.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">{t.listing.dealbreakers}</h2>
          <div className="flex flex-wrap gap-2">
            {listing.dealbreakers.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {!isOwner && (
        <ApplyForm
          locale={locale}
          t={t}
          listingId={listing.id}
          prompt={listing.applicantPrompt}
          signedIn={Boolean(user)}
          alreadyApplied={alreadyApplied}
        />
      )}
    </article>
  );
}
