import { getDictionary } from "@/i18n";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { HU_CITIES } from "@/lib/taxonomy";
import ListingForm from "@/components/ListingForm";

export default async function NewListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const user = await currentUser();

  const [tags, cities] = await Promise.all([
    prisma.techTag.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
  ]);

  const activeListing = user
    ? await prisma.listing.findFirst({ where: { ownerId: user.id, status: "ACTIVE" } })
    : null;

  if (activeListing) {
    return (
      <div className="card">
        <p className="text-sm text-neutral-700">{t.dashboard.title}</p>
        <a href={`/${locale}/dashboard`} className="btn-primary mt-3">
          {t.nav.myListing}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t.form.newTitle}</h1>
      <ListingForm
        locale={locale}
        t={t}
        tags={tags.map((tag) => ({ name: tag.name, category: tag.category }))}
        cities={cities.length > 0 ? cities.map((city) => city.name) : HU_CITIES}
        defaultFullName={user?.fullName}
        defaultPhotoUrl={user?.photoUrl}
        signedIn={Boolean(user)}
      />
    </div>
  );
}
