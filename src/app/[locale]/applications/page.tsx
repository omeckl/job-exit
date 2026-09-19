import Link from "next/link";
import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";

export default async function MyApplicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login`);

  const applications = await prisma.application.findMany({
    where: { applicantId: user.id },
    orderBy: { createdAt: "desc" },
    include: { listing: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t.applications.title}</h1>
      {applications.length === 0 ? (
        <p className="text-neutral-600">{t.applications.empty}</p>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <div key={application.id} className="card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/${locale}/h/${application.listing.slug}`} className="font-medium">
                  {application.listing.title}
                </Link>
                <span className="text-sm text-neutral-500">
                  {application.createdAt.toISOString().slice(0, 10)}
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                {application.handoverSentAt
                  ? t.applications.statusHandover
                  : application.listing.status === "CLOSED"
                    ? t.applications.listingClosed
                    : t.applications.statusSent}
              </p>
              {application.handoverMessage && (
                <p className="whitespace-pre-line rounded-lg bg-[color:var(--color-brand-soft)] p-3 text-sm">
                  {application.handoverMessage}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
