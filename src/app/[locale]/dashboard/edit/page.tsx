import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { HU_CITIES } from "@/lib/taxonomy";
import ListingForm from "@/components/ListingForm";

export default async function EditListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login`);

  const listing = await prisma.listing.findFirst({
    where: { ownerId: user.id, status: "ACTIVE" },
  });
  if (!listing) redirect(`/${locale}/new`);

  const [tags, cities] = await Promise.all([
    prisma.techTag.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t.form.editTitle}</h1>
      <ListingForm
        locale={locale}
        t={t}
        tags={tags.map((tag) => ({ name: tag.name, category: tag.category }))}
        cities={cities.length > 0 ? cities.map((city) => city.name) : HU_CITIES}
        listing={listing}
        defaultFullName={user.fullName}
        defaultPhotoUrl={user.photoUrl}
        signedIn
      />
    </div>
  );
}
